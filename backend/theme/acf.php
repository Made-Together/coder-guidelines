<?php

/**
 * Save ACF JSON
 */
add_filter('acf/settings/save_json', function ($path) {
	$custom_path = get_stylesheet_directory() . '/acf-json';
	if ($path !== $custom_path) {
		$path = $custom_path;
	}
	return $path;
});

/**
 * Load ACF JSON
 */
add_filter('acf/settings/load_json', function ($paths) {
	$custom_path = get_stylesheet_directory() . '/acf-json';
	if (!in_array($custom_path, $paths)) {
		$paths[] = $custom_path;
	}
	return $paths;
});

/**
 * Add options pages
 */
if (function_exists('acf_add_options_page')) {
	function register_acf_options_pages()
	{
		// check function exists
		if (!function_exists('acf_add_options_page')) {
			return;
		}

		// register header options page
		acf_add_options_page([
			'page_title' => 'Header',
			'menu_title' => 'Header',
			'menu_slug' => 'header',
			'capability' => 'edit_posts',
			'show_in_graphql' => true,
		]);

		// register footer options page
		acf_add_options_page([
			'page_title' => 'Footer',
			'menu_title' => 'Footer',
			'menu_slug' => 'footer',
			'capability' => 'edit_posts',
			'show_in_graphql' => true,
		]);

		// register redirects page
		acf_add_options_page([
			'page_title' => 'Redirects',
			'menu_title' => 'Redirects',
			'menu_slug' => 'redirects',
			'capability' => 'edit_posts',
			'show_in_graphql' => true,
		]);
	}

	add_action('acf/init', 'register_acf_options_pages');
}
