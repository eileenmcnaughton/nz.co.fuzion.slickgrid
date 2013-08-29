<?php

require_once 'CRM/Core/Page.php';

class CRM_Slickgrid_Page_SlickGrid extends CRM_Core_Page {
  protected $profileID;

  function run() {
    CRM_Utils_System::setTitle(ts('SlickGrid Data Entry'));
    $this->id = CRM_Utils_Request::retrieve('gridid', 'String');
    CRM_Core_Resources::singleton()
    ->addSetting(array('form' => array('grid_id' => $this->id)))
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/lib/firebugx.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/lib/jquery-1.7.min.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/lib/jquery-ui-1.8.16.custom.min.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/lib/jquery.event.drag-2.2.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/slick.core.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/plugins/slick.cellrangedecorator.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/plugins/slick.cellrangeselector.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/plugins/slick.cellselectionmodel.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/civislick.formatters.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/civislick.editors.js')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/slick.grid.js')
    ->addStyleFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/slick.grid.css')
    ->addScriptFile('nz.co.fuzion.slickgrid', 'templates/CRM/Slickgrid/Page/SlickGrid.js')
    ->addStyleFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/css/smoothness/jquery-ui-1.8.16.custom.css')
    ->addStyleFile('nz.co.fuzion.slickgrid', 'js/SlickGrid/examples/examples.css')
    ->addStyleFile('nz.co.fuzion.slickgrid', 'css/civislick.css')
    ;
    $this->id = CRM_Utils_Request::retrieve('gridid', 'String');
    if(empty($this->id)) {
      CRM_Utils_System::redirect(CRM_Utils_System::url('civicrm/slickgrid/batch', 'reset=1'));

    }

    $this->profileID = civicrm_api3('SlickBatch', 'getvalue', array('return' => 'profile_id', 'id' => $this->id));
    if($this->profileID) {
      $fields = civicrm_api3('profile', 'getfields', array('get_options' => 'all', 'action' => 'submit', 'profile_id' => $this->profileID));
    }

    $columns = $data = array();
    $savedData = civicrm_api3('SlickGrid', 'get', array('grid_id' => $this->id));
    $savedRowCount = $savedData['count'];
    foreach ($savedData['values'] as $rowNumber => $savedRow) {
      $data[$rowNumber - 1] = array_intersect_key($savedRow, $fields['values']);
    }

    foreach ($fields['values'] as $field => $spec) {
      if(empty($spec['title'])) {
        continue;
      }
      $column = array(
        'id' => $field,
        'name' => $spec['title'],
        'field' => $field,
        'editor' => $spec['type'],
      );
      if(isset($spec['options'])) {
        $column['options'] = $spec['options'];
      }
      $columns[] = $column;
      if(empty($savedRowCount)) {
        $data[$savedRowCount][$field] = CRM_Utils_Array::value('default_value', $spec, '');
      }
    }
    $config = CRM_Core_Config::singleton();
    $resourceURL = $config->extensionsURL . '/nz.co.fuzion.slickgrid';
    CRM_Core_Resources::singleton()->addSetting(array(
      'Form' => array(
        'Columns' => $columns,
        'Data' => $data
      ),
      'Setting' => array(
        'extensionURL' => $resourceURL,
      )
    ));

    parent::run();
  }
}
