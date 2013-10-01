<?php
/*
 * +--------------------------------------------------------------------+ |
 * CiviCRM version 4.4 |
 * +--------------------------------------------------------------------+ |
 * Copyright CiviCRM LLC (c) 2004-2013 |
 * +--------------------------------------------------------------------+ | This
 * file is a part of CiviCRM. | | | | CiviCRM is free software; you can copy,
 * modify, and distribute it | | under the terms of the GNU Affero General
 * Public License | | Version 3, 19 November 2007 and the CiviCRM Licensing
 * Exception. | | | | CiviCRM is distributed in the hope that it will be useful,
 * but | | WITHOUT ANY WARRANTY; without even the implied warranty of | |
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. | | See the GNU Affero
 * General Public License for more details. | | | | You should have received a
 * copy of the GNU Affero General Public | | License and the CiviCRM Licensing
 * Exception along | | with this program; if not, contact CiviCRM LLC | | at
 * info[AT]civicrm[DOT]org. If you have questions about the | | GNU Affero
 * General Public License or the licensing of CiviCRM, | | see the CiviCRM
 * license FAQ at http://civicrm.org/licensing |
 * +--------------------------------------------------------------------+
 */

/**
 *
 * @package CRM
 * @copyright CiviCRM LLC (c) 2004-2013
 *            $Id$
 *
 */
/*
 * Settings metadata file
 */

return array(
  'address_validation_limit' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_validation_limit',
    'type' => 'Integer',
    'default' => 2300,
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'Limit to Address Validation Entries',
    'help_text' => 'Limit Address validation'
  ),
  'address_validation_counter' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_validation_counter',
    'type' => 'Integer',
    'default' => 1,
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'Current usage within limit',
    'help_text' => 'Current usage within limit'
  ),
  'address_validation_timestamp' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_validation_timestamp',
    'type' => 'Integer',
    'default' => 0,
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'System Maintained setting for 24 hour time frame',
    'help_text' => 'System Maintained setting for 24 hour time frame'
  ),
  'address_lookup_class' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_lookup_class',
    'type' => 'String',
    'default' => 'CRM_Utils_Address_Lookup_Google',
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'Class For Address Autocompletes',
    'help_text' => 'Class For Address Autocompletes'
  ),
  'address_lookup_data_field' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_lookup_data_field',
    'type' => 'String',
    'default' => '',
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'Field to store raw address lookup data',
    'help_text' => 'Field to store raw address lookup data'
  ),
  'address_lookup_status_field' => array(
    'group_name' => 'Address Standardization Preferences',
    'group' => 'address',
    'name' => 'address_lookup_status_field',
    'type' => 'String',
    'default' => '',
    'add' => '4.4',
    'is_domain' => 1,
    'is_contact' => 0,
    'description' => 'Field to store raw address lookup status',
    'help_text' => "Field to store raw address lookup status. Must be select & support 'Verified', 'Needs Review', & 'Reviewed'"
  ),
);
