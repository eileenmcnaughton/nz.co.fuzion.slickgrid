<?php

function civicrm_api3_slick_batch_create($params) {
  //@todo - preliminary code - needs re-writing with BAO

  $fields = civicrm_api3('profile', 'getfields', array('profile_id' => $params['profile_id'], 'action' => 'submit'));
  $fieldStatements = array();
  foreach ($fields['values'] as $fieldName => $specs) {
    if($fieldName == 'profile_id') {
      continue;
    }
    $fieldStatements[] =  str_replace('-', '__', $fieldName) . _civicrm_api3_getfieldsqlstring($specs['type']);
  }
  $fieldStatement = implode(' , ', $fieldStatements);
  //do we rename id ? needs to be unique but current implementation (hackery) is no autoincrement
  $table = 'civicrm_slickgrid_' . $params['profile_id'] . date('Y_m_d') . rand(0,100);
  $sql = "CREATE TABLE $table ( grid_id INT(10) UNSIGNED NOT NULL,
    $fieldStatement
  )";

  CRM_Core_DAO::executeQuery($sql);

  $sql = "INSERT INTO civicrm_slickbatch (profile_id, temp_table) values({$params['profile_id']}, '{$table}')";
  CRM_Core_DAO::executeQuery($sql);

  $sql = "SELECT MAX(id) from  civicrm_slickbatch";
  $id = CRM_Core_DAO::singleValueQuery($sql);
  return civicrm_api3_create_success(array($id => array('id' => $id)));

}

function civicrm_api3_slick_batch_get($params) {
  //@todo - preliminary code - needs re-writing with BAO
  $sql = "SELECT id, profile_id, temp_table FROM civicrm_slickbatch WHERE id = " . $params['id'];
  $dao = CRM_Core_DAO::executeQuery($sql);
  $values = array();
  while($dao->fetch()) {
    $values[$dao->id] = array('id' => $dao->id, 'profile_id' => $dao->profile_id, 'temp_table' => $dao->temp_table);
  }
  return civicrm_api3_create_success($values, $params);
}

function civicrm_api3_slick_batch_submit($params) {
  //@todo - preliminary code - needs re-writing with BAO
  $batch = civicrm_api3('slick_batch', 'getsingle', array('id' => $params['id']));
  $grid = civicrm_api3('slick_grid', 'get', array('grid_id' => $params['id']));
  $params = array('id' => $batch['profile_id']);
  foreach ($grid['values'] as &$gridEntry) {
    unset($gridEntry['id']);
    $gridEntry['profile_id'] = $batch['profile_id'];
    $params['api.profile.submit'][] = $gridEntry;
  }
  //actually should be null parent :-)
  $result = (civicrm_api3('uf_group', 'get', $params));
  return civicrm_api3_create_success($result, $params);
}

function civicrm_api3_slick_batch_delete($params) {
  //@todo - preliminary code - needs re-writing with BAO
  $batch = civicrm_api3('slick_batch', 'getsingle', array('id' => $params['id']));
  CRM_Core_DAO::executeQuery("DROP TABLE IF EXISTS " . $batch['temp_table']);
  CRM_Core_DAO::executeQuery("DELETE FROM civicrm_slickbatch WHERE id = " . $params['id']);
  return civicrm_api3_create_success(TRUE, $params);
}

function _civicrm_api3_getfieldsqlstring($type) {
  switch($type) {
    case 1:
    case 16:
      return ' INT(10) UNSIGNED ';
      break;
   // case 12 :
      return ' DATETIME NULL ';
      break;
    case 1024 :
      return ' DECIMAL(20,2) ';
      break;
    default :
      return " VARCHAR(50) NULL ";
  }

}