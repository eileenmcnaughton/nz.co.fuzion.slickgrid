<?php

function civicrm_api3_slick_grid_create($params) {
  //@todo - preliminary code - needs re-writing with BAO
  $tempTable = civicrm_api3('SlickBatch', 'getvalue', array('id' => $params['grid_id'], 'return' => 'temp_table'));
  $id = $params['id'];
  $ignoredKeys = array('id', 'grid_id', 'check_permissions', 'version');
  $fields = array_diff_key($params, array_fill_keys($ignoredKeys, 1));
  //@todo get rid of all this crap & sort out the escaping
  $exists = CRM_Core_DAO::singleValueQuery(" SELECT count(*) FROM $tempTable WHERE grid_id = " . $params['id']);
  if($exists) {
    $sql = " UPDATE $tempTable SET ";
    foreach ($fields as $field => $value) {
      $sql .= str_replace('-', '__', $field) . " = '$value' ";
    }
    $sql .= " WHERE grid_id = " . $id;
  }
  else{
    $sql = " INSERT INTO $tempTable (grid_id, ". str_replace('-', '__', implode(',', array_keys($fields))) . ') '
     . 'values(' . $params['id'] . ", '" . implode(',', $fields) . "')";
  }
  CRM_Core_DAO::executeQuery($sql);

  return civicrm_api3_create_success(array($params['id'] => array('id' => $params['id'] )));

}
function civicrm_api3_slick_grid_get($params) {
  //@todo - preliminary code - needs re-writing with BAO
  $tempTable = civicrm_api3('SlickBatch', 'getvalue', array('id' => $params['grid_id'], 'return' => 'temp_table'));
  $sql = " SELECT * FROM $tempTable";
  $dao = CRM_Core_DAO::executeQuery($sql);
  $values = array();
  while($dao->fetch()) {
    $values[$dao->grid_id] = array();
    foreach ($dao as $field => $value) {
      if(substr($field, 0, 1) == '_' || $field == 'N') {
        continue;
      }
      $values[$dao->grid_id][str_replace('__', '-', $field)] = $value;
    }
  }
  return civicrm_api3_create_success($values, $params);
}