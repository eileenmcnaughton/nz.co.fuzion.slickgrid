<?php

require_once 'CRM/Core/Form.php';

/**
 * Form controller class
 *
 * @see http://wiki.civicrm.org/confluence/display/CRMDOC43/QuickForm+Reference
 */
class CRM_Slickgrid_Form_SlickgridBatch extends CRM_Core_Form {
  function buildQuickForm() {
    $result = civicrm_api3('uf_field', 'getoptions', array('field' => 'uf_group_id'));
    $profileOptions = $result['values'];
    CRM_Core_Resources::singleton()->addScriptFile('nz.co.fuzion.slickgrid', 'templates/CRM/Slickgrid/Form/SlickgridBatch.js');
    $this->add(
      'select', // field type
      'profile_id', // field name
      ts('Select Profile'), // field label
      $profileOptions, // list of options
      true // is required
    );

    $this->addButtons(array(
      array(
        'type' => 'submit',
        'name' => ts('Submit'),
        'isDefault' => TRUE,
      ),
    ));

    parent::buildQuickForm();
  }

  function postProcess() {
    $values = $this->exportValues();
    $fields = civicrm_api3('profile', 'getfields', array('profile_id' => $values['profile_id'], 'action' => 'submit'));
    $slickBatch = civicrm_api3('SlickBatch', 'create', array('profile_id' => $values['profile_id'], 'action' => 'submit'));
    CRM_Utils_System::redirect(CRM_Utils_System::url('civicrm/civislick/grid', 'reset=1&gridid=' . $slickBatch['id']));
    parent::postProcess();
  }
}
