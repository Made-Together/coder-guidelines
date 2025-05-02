<?php
@ini_set('log_errors','On');
@ini_set('display_errors','Off');
@ini_set('error_reporting', E_ALL );

// Global Options
$GLOBALS['together_options'] = [
	'permalink_structure' => '/resources/%postname%/'
];

include "format-media-titles.php";
include "helpers.php";
include 'settings.php';
include 'initial-setup.php';
include 'cleanup.php';
include 'acf.php';
include 'api.php';
include 'revalidate-webhooks.php';
include 'links.php';
