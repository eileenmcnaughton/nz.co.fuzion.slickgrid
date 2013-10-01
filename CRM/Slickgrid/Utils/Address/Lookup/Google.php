<?php
/**
 * Class that uses google geocoder
*/
class CRM_Utils_Address_Lookup_Google {

 /**
  * server to retrieve the lat/long
  *
  * @var string
  * @static
  */
 protected $_server = 'maps.googleapis.com';

 /**
  * uri of service
  *
  * @var string
  * @static
  */
 protected $_uri = '/maps/api/geocode/xml?sensor=false&address=';

 /**
  * function that takes an address object and gets the latitude / longitude for this
  * address. Note that at a later stage, we could make this function also clean up
  * the address into a more valid format
  *
  * @param object $address
  *
  * @return boolean true if we modified the address, false otherwise
  * @static
  */
 function format(&$values, $stateName = FALSE) {
  // we need a valid country, else we ignore
  if (!CRM_Utils_Array::value('country', $values)) {
   return FALSE;
  }
  if($this->checkLimit()) {
   return;
  }
  $config = CRM_Core_Config::singleton();

  $add = '';

  if (CRM_Utils_Array::value('street_address', $values)) {
   $add = urlencode(str_replace('', '+', $values['street_address']));
   $add .= ',+';
  }

  $city = CRM_Utils_Array::value('city', $values);
  if ($city) {
   $add .= '+' . urlencode(str_replace('', '+', $city));
   $add .= ',+';
  }

  if (CRM_Utils_Array::value('state_province', $values)) {
   if (CRM_Utils_Array::value('state_province_id', $values)) {
    $stateProvince = CRM_Core_DAO::getFieldValue('CRM_Core_DAO_StateProvince', $values['state_province_id']);
   }
   else {
    if (!$stateName) {
     $stateProvince = CRM_Core_DAO::getFieldValue('CRM_Core_DAO_StateProvince',
       $values['state_province'],
       'name',
       'abbreviation'
     );
    }
    else {
     $stateProvince = $values['state_province'];
    }
   }

   // dont add state twice if replicated in city (happens in NZ and other countries, CRM-2632)
   if ($stateProvince != $city) {
    $add .= '+' . urlencode(str_replace('', '+', $stateProvince));
    $add .= ',+';
   }
  }

  if (CRM_Utils_Array::value('postal_code', $values)) {
   $add .= '+' . urlencode(str_replace('', '+', $values['postal_code']));
   $add .= ',+';
  }

  if (CRM_Utils_Array::value('country', $values)) {
   $add .= '+' . urlencode(str_replace('', '+', $values['country']));
  }
  $query = 'http://' . $this->_server . $this->_uri . $add;

  require_once 'HTTP/Request.php';
  $request = new HTTP_Request($query);
  $request->sendRequest();
  $string = $request->getResponseBody();

  libxml_use_internal_errors(TRUE);
  $xml = @simplexml_load_string($string);
  if ($xml === FALSE) {
   // account blocked maybe?
   CRM_Core_Error::debug_var('Geocoding failed.  Message from Google:', $string);
   return FALSE;
  }

  if (isset($xml->status)) {
   if ($xml->status == 'OK' &&
   is_a($xml->result->geometry->location,
     'SimpleXMLElement'
   )
   ) {
    $changed = TRUE;
    $status = NULL;
    $ret = $xml->result->geometry->location->children();
    if(!empty($values['geo_code_1']) && $values['geo_code_1'] == (float)$ret->lat){
     $changed = FALSE;
    }
    $address = array();
    foreach ($xml->result->address_component as $component){
     $type = (string) $component->type;
     $element = (string) $component->long_name;
     $address[$type] = $element;
    }

    //nz related address hack  - doesn't belong here but will move if code generalised
    if(substr($values['street_number_suffix'], 0, 1) == '/'
      && strstr($values['street_address'], $values['street_number'] . $values['street_unit'])) {
     $values['street_unit'] = $values['street_number'];
     $values['street_number'] = substr($values['street_number_suffix'], 1);
     $values['street_number_suffix'] = '';
    }

    if( !empty($address['street_number'])
    && (($address['street_number'] == CRM_Utils_Array::value('street_number', $values)
      || $address['street_number'] == CRM_Utils_Array::value('street_number', $values) . CRM_Utils_Array::value('street_number_suffix', $values)
    ))
    // because it could be keyed route, street
    && array_search($values['street_name'], $address)
    //google locality is in our address
    && (array_search($address['locality'], $values)
      || (
        $values['postal_code'] == $address['postal_code']
        && substr($values['supplemental_address_1'], 0, 2) == 'RD'
      )

    )) {
     $status = 'Verified';
     if(empty($values['postal_code']) || $values['postal_code'] != $address['postal_code']){
      $values['postal_code'] = $address['postal_code'];
     }
    }
    else{
     if($changed){
      // if changed set to needs review
      CRM_Core_Session::setStatus('This address is not a good google match', 'Address Check Required', 'notice');
      $status = 'Needs Review';
     }
     else{
      //if not changed only set if status is not 'reviewed'
      $currentValue = civicrm_api('custom_value', 'get', array('version' => 3, 'entity_id' => $values['id'], 'entity_table' => 'civicrm_address'));
      if($currentValue['values'][28][0] == 'Reviewed') {
       $status = 'Reviewed';
      }
      else{
       $status = 'Needs Review';
       CRM_Core_Session::setStatus('This address is not a good google match');
      }
     }
    }

    $customFieldID = $this->getCustomFieldIDFromArray($values, 28);
    if($customFieldID){
     $values['custom_29_' . $customFieldID] = json_encode($address);
     $values['custom_28_' . $customFieldID] = $status;
     if($status != 'Verified'){

     }
    }
    elseif(empty($values['id'])){
     $values['custom_29'] = json_encode($address);
     $values['custom_28'] = $status;
    }
    else{
     $addressStatus = array('entity_id' => $values['id'], 'entity_table' => 'civicrm_address', 'version' => 3,);
     $addressStatus['custom_29'] = json_encode($address);
     $addressStatus['custom_28'] = $status;
     $result = civicrm_api('custom_value', 'create', $addressStatus);
    }
    $ret = $xml->result->geometry->location->children();
    if ($ret->lat && $ret->lng) {
     $values['geo_code_1'] = (float)$ret->lat;
     $values['geo_code_2'] = (float)$ret->lng;
     return TRUE;
    }
   }
   elseif ($xml->status == 'OVER_QUERY_LIMIT') {
    // fataling here is really bad
    //CRM_Core_Error::fatal('Geocoding failed. Message from Google: ' . $xml->status);
    // if changed set to needs review

    CRM_Core_Session::setStatus('Google has enforced an api limit', 'Google Limit', 'notice');

   }
   elseif ($xml->status == 'ZERO_RESULTS') {
    $values['geo_code_1'] = $values['geo_code_2'] = 'null';
    return array($values['result'] => 'geocode failed');
   }
  }

  // reset the geo code values if we did not get any good values
  $values['geo_code_1'] = $values['geo_code_2'] = 'null';
  return FALSE;
 }
}
