<?php
function civicrm_api3_address_match($params) {
  $matchFields = array('street_address', 'supplemental_address_1', 'city', 'state_province_id');
  $matchFields = array_intersect_key($params, array_fill_keys($matchFields,1));
  if(!empty($params['contact_id'])) {
   $matchFields['contact_id'] = array('NOT IN' => (array) $params['contact_id']);
  }
  return civicrm_api3_create_success($matchFields);
}

function _civicrm_api3_address_match_spec(&$params) {

}

