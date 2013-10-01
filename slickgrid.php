<?php

require_once 'slickgrid.civix.php';

/**
 * Implementation of hook_civicrm_config
 */
function slickgrid_civicrm_config(&$config) {
  _slickgrid_civix_civicrm_config($config);
}

/**
 * Implementation of hook_civicrm_xmlMenu
 *
 * @param $files array(string)
 */
function slickgrid_civicrm_xmlMenu(&$files) {
  _slickgrid_civix_civicrm_xmlMenu($files);
}

/**
 * Implementation of hook_civicrm_install
 */
function slickgrid_civicrm_install() {
  CRM_Core_DAO::executeQuery("
    CREATE TABLE `civicrm_slickbatch` (
     `id` INT(10) NOT NULL AUTO_INCREMENT,
     `profile_id` INT(10) NULL,
     `batch_id` INT(10) NULL,
     `defaults` VARCHAR(50) NULL,
     `temp_table` VARCHAR(50) NULL,
     PRIMARY KEY (`id`)
    )
    COLLATE='utf8_general_ci'
    ENGINE=InnoDB;
  ");
  return _slickgrid_civix_civicrm_install();
}

/**
 * Implementation of hook_civicrm_uninstall
 */
function slickgrid_civicrm_uninstall() {
  return _slickgrid_civix_civicrm_uninstall();
}

/**
 * Implementation of hook_civicrm_enable
 */
function slickgrid_civicrm_enable() {
  return _slickgrid_civix_civicrm_enable();
}

/**
 * Implementation of hook_civicrm_disable
 */
function slickgrid_civicrm_disable() {
  return _slickgrid_civix_civicrm_disable();
}

/**
 * Implementation of hook_civicrm_upgrade
 *
 * @param $op string, the type of operation being performed; 'check' or 'enqueue'
 * @param $queue CRM_Queue_Queue, (for 'enqueue') the modifiable list of pending up upgrade tasks
 *
 * @return mixed  based on op. for 'check', returns array(boolean) (TRUE if upgrades are pending)
 *                for 'enqueue', returns void
 */
function slickgrid_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _slickgrid_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implementation of hook_civicrm_managed
 *
 * Generate a list of entities to create/deactivate/delete when this module
 * is installed, disabled, uninstalled.
 */
function slickgrid_civicrm_managed(&$entities) {
  return _slickgrid_civix_civicrm_managed($entities);
}

function slickgrid_civicrm_navigationMenu(&$menu) {
 $maxID = CRM_Core_DAO::singleValueQuery("SELECT max(id) FROM civicrm_navigation");
 $navId = $maxID + 1;
 $menu[$navId] = array (
   'attributes' => array (
     'label' => 'CiviSlick',
     'name' => 'CiviSlick',
     'url' => null,
     'permission' => 'administer CiviCRM',
     'operator' => null,
     'separator' => null,
     'parentID' => null,
     'active' => 1,
   ),
   'child' => array (
     $navId+1 => array(
         'attributes' => array(
       'label' => 'CiviSlick',
       'name' => 'CiviSlick',
       'url' => 'civicrm/civislick',
       'permission' => 'administer CiviCRM',
         'operator' => null,
         'separator' => 1,
         'active' => 1,
       'parentID'   => $navId,
     ),),
     $navId+2 => array (
       'attributes' => array(
         'label' => 'CiviSlick Batch',
         'name' => 'CiviSlick Batch',
         'url' => 'civicrm/civislick/batch',
         'permission' => 'administer CiviCRM',
         'operator' => null,
         'separator' => 1,
         'active' => 1,
         'parentID'   => $navId,
     )))
 );
}
