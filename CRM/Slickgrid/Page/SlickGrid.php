<?php

class CRM_Slickgrid_Page_SlickGrid extends CRM_Core_Page {
  protected $profileID;
  protected $id;

  function run() {
    $this->id = CRM_Utils_Request::retrieve('gridid', 'String');
    CRM_Core_Resources::singleton()
    ->addSetting(array('form' => array('grid_id' => $this->id)))
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/lib/firebugx.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/lib/jquery-1.7.min.js', 1)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/lib/jquery-ui-1.8.16.custom.min.js', 2)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/lib/jquery.event.drag-2.2.js', 3)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/slick.core.js', 4)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/slick.dataview.js', 5)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/plugins/slick.cellrangedecorator.js', 5)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/plugins/slick.cellrangeselector.js', 6)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/plugins/slick.cellselectionmodel.js', 7)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/civislick.formatters.js', 8)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/civislick.editors.js', 9)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/civislick.validators.js', 10)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/slick.grid.js', 11)
    ->addStyleFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/slick.grid.css', 12)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'templates/CRM/Slickgrid/Page/SlickGrid.js', 13)
   // ->addScriptFile('nz.co.fuzion.slickgrid', 'templates/CRM/Slickgrid/Page/contactEditor.js')// can't add like this as need to set script type
    ->addStyleFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/css/smoothness/jquery-ui-1.8.16.custom.css')
    ->addStyleFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/examples/examples.css', 14)
    ->addStyleFile('nz.co.fuzion.slickgrid', 'css/civislick.css', 15)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'packages/SlickGrid/examples/slick.compositeeditor.js', 15)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/jquery.tmpl.min.js', 16)
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/AutoComplete.js', 17)
    ->addStyleFile('nz.co.fuzion.slickgrid', 'css/inlineEditor.css', 18)
    ->addScriptFile('civicrm', 'js/jquery/jquery.crmeditable.js', 19)
    ->addScriptURL('http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false', 200);
    ;
    $this->id = CRM_Utils_Request::retrieve('gridid', 'String');
    if(empty($this->id)) {
      CRM_Utils_System::redirect(CRM_Utils_System::url('civicrm/civislick/batch', 'reset=1'));
    }

    $this->profileID = civicrm_api3('SlickBatch', 'getvalue', array('return' => 'profile_id', 'id' => $this->id));
    if($this->profileID) {
      $fields = civicrm_api3('profile', 'getfields', array('get_options' => 'all', 'action' => 'submit', 'profile_id' => $this->profileID));
    }
    $fields = $fields['values'];
    $contactFields = $this->getContactFields($fields);
    $this->appendContactFields($fields, $contactFields);

    $profileTitle = civicrm_api3('uf_group', 'getvalue', array('return' => 'title', 'id' => $this->profileID));
    CRM_Utils_System::setTitle(ts('CiviSlick Data Entry - profile : ' . $profileTitle));
    $columns = $data = array();
    $savedData = civicrm_api3('SlickGrid', 'get', array('grid_id' => $this->id));
    $savedRowCount = $savedData['count'];
    foreach ($savedData['values'] as $rowNumber => $savedRow) {
      $data[$rowNumber - 1] = array_intersect_key($savedRow, $fields);
      $data[$rowNumber - 1]['id'] = $savedRow['grid_id'];
      foreach ($contactFields as $idField => $nameField) {
        $data[$rowNumber - 1][$nameField] = $savedRow[$nameField];
      }
    }

    $totalWidth = 0;
    foreach ($fields as $field => $spec) {
      if(empty($spec['title'])) {
        continue;
      }
      $width = 0;
      if(isset($spec['options'])) {
        foreach ($spec['options'] as $option) {
           if(strlen($option) > $width) {
            $width = strlen($option);
           }
        }
      }
      if(CRM_Utils_Array::value('size', $spec) > $width) {
       $width = $spec['size'];
      }
      $width += 80;
      $column = array(
        'id' => $field,
        'name' => $spec['title'],
        'field' => $field,
        'editor' => $spec['type'],
        'width' => $width,
        'sortable' => TRUE,
      );
      if($spec['type'] == 1024) {
       $column['showTotalsHeader'] = TRUE;
      }
      if(isset($spec['options'])) {
        $column['options'] = $spec['options'];
      }
      if(isset($spec['rule'])) {
        $column['rule'] = $spec['rule'];
      }
      if(!empty($spec['api.required'])) {
        $column['required'] = TRUE;
      }
      $columns[] = $column;
      if(empty($savedRowCount)) {
        $data[$savedRowCount][$field] = CRM_Utils_Array::value('default_value', $spec, '');
        $data[$savedRowCount]['id'] = 1;
      }
      $totalWidth += $width;
    }

   /* if($addContactID) {
      array_unshift($columns, array(
        'id' => 'contact_id_name',
        'name' => 'Contact',
        'field' => 'contact_id_name',
        'editor' => 5000,// using integer since other types are integers- maps to contact select
      ));
    }*/
    $newProfiles = array('new_individual', 'new_organization', 'new_household');
    $newProfileFields = array();
    foreach ($newProfiles as $index => $profile) {
      $fields = civicrm_api3('profile', 'getfields', array('get_options' => 'all', 'action' => 'submit', 'profile_id' => $profile));
      $newProfileFields[$profile] = $fields['values'];
    }
    $this->assignAddressLookupData();
    $this->assign('gridWidth', $totalWidth);
    $config = CRM_Core_Config::singleton();
    $resourceURL = $config->extensionsURL . '/nz.co.fuzion.slickgrid';
    CRM_Core_Resources::singleton()->addSetting(array(
      'Form' => array(
        'Columns' => $columns,
        'Data' => $data,
      ),
      'Setting' => array(
        'extensionURL' => $resourceURL,
      ),
      'Profile' => $newProfileFields,
    ));
    parent::run();
  }

  /**
   * We will add on fields for the contact_id if required & the display name for any other contact id fields
   * @param array $fields
   */
  function appendContactFields(&$fields) {
   $addContactID = FALSE;
   foreach ($fields as $profileField => $specs) {
    if($profileField == 'profile_id') {
     continue;
    }
    if(in_array(strtolower($specs['entity']), array('contribution', 'membership', 'activity', 'participant'))) {
     //at this stage we will just always add contact id if it seems to include other entities - perhaps we should always?
     $addContactID = TRUE;
    }
    if(CRM_Utils_Array::value('FKClassName', $specs) ==  'CRM_Contact_DAO_Contact') {
      $fields[$profileField]['type'] = 5000;
      $fields[$profileField]['name_field'] = $profileField . '_name';
      $fields[$profileField]['name_field'] = $profileField . '_name';
    }
    if(CRM_Utils_Array::value('data_type',$specs) ==  'ContactReference') {
      $fields[$profileField]['type'] = 5001;
      $fields[$profileField]['url'] = CRM_Utils_System::url('civicrm/ajax/contactref', 'context=customfield&id=' . CRM_Core_BAO_CustomField::getKeyID($profileField));
    }

   }
   if($addContactID) {
     $fields = array_merge(array(
       'contact_id' => array(
         'title' => 'Contact', 'type' => 5000,
         'size' => 60,
         'entity' => 'contact',
         'name_field' => 'contact_id_name',
         'required' => true,
       ),
      // 'contact_id_name' => array('title' => 'Contact', 'type' => 5000)
     ), $fields);
   }
  }

  /**
   * Get a list of fields that will have a lookup
   * @param unknown $fields
   */
  function getContactFields($fields) {
   $contactFields = array();
   foreach ($fields as $profileField => $specs) {
    if($profileField == 'profile_id') {
     continue;
    }
    if(in_array(strtolower($specs['entity']), array('contribution', 'membership', 'activity', 'participant'))) {
     //at this stage we will just always add contact id if it seems to include other entities - perhaps we should always?
     $contactFields['contact_id'] = 'contact_id_name';
    }
    if(CRM_Utils_Array::value('FKClassName', $specs) ==  'CRM_Contact_DAO_Contact'
      || CRM_Utils_Array::value('data_type',$specs) ==  'ContactReference'
    ) {
     $contactFields[$profileField] = $profileField . '_name';
    }

   }
   return $contactFields;
}
/**
 * Currently just google & 'on' but will allow 'off'/ others
 */
 function assignAddressLookupData() {
 $domainContact = civicrm_api3('domain', 'get', array('current_domain' => 1, 'sequential' => 1));
 CRM_Core_Resources::singleton()->addScriptURL('http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false')
 ->addSetting(array('Domain' => $domainContact['values'][0]['domain_address']))
 ;
 }
}

