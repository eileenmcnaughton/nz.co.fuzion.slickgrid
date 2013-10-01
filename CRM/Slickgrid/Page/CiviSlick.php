<?php

class CRM_Slickgrid_Page_CiviSlick extends CRM_Core_Page {

 function run() {
  $batches = civicrm_api3('SlickBatch', 'get', array());
  foreach ($batches['values'] as &$batch) {
    $batch['profile'] = civicrm_api3('uf_group', 'getvalue', array(
      'return' => 'title',
      'id' => $batch['profile_id'])
    );
    $batch['url'] = CRM_Utils_System::url('civicrm/civislick/grid', "reset=1&gridid={$batch['id']}");
  }
  $this->assign('batches', $batches['values']);
  CRM_Core_Resources::singleton()->addScriptFile('nz.co.fuzion.slickgrid', 'templates/CRM/Slickgrid/Page/CiviSlick');
  parent::run();
 }
}
