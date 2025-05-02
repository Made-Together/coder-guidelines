<?php

add_action('init', function () {
	$initial_setup_complete = get_option('initial_setup_complete');
	if ($initial_setup_complete) return;

	$homepage = create_page('Home');
	$resources = create_page('Resources');

	// Set the home page
	if ($homepage) {
		update_option('page_on_front', $homepage->ID);
		update_option('show_on_front', 'page');
	}

	// Set the resources page
	if ($resources) {
		update_option('page_for_posts', $resources->ID);
	}

	// Set default permalink structure
	global $wp_rewrite;
	if (!empty($GLOBALS['together_options']['permalink_structure'])) {
		$wp_rewrite->set_permalink_structure($GLOBALS['together_options']['permalink_structure']);
	}

	// Set the option so this function doesn't keep on firing
	add_option('initial_setup_complete', true);
});


function create_page($pageName) {
	$page = get_page_by_title($pageName, 'OBJECT', 'page');

	// Check if the page already exists
	if (!empty($page)) {
		return $page;
	} else {
		$page_id = wp_insert_post(
			[
				'comment_status' => 'close',
				'ping_status'    => 'close',
				'post_author'    => 1,
				'post_title'     => $pageName,
				'post_name'      => strtolower(str_replace(' ', '-', trim($pageName))),
				'post_status'    => 'publish',
				'post_content'   => '',
				'post_type'      => 'page',
			]
		);

		return get_post($page_id);
	}
}
