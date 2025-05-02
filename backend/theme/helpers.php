<?php

// Echo out $value in readable format (used for testing)
function td($value = '')
{
	echo '<pre>';
	print_r($value);
	die();
}

// Return all post type names in an array
function get_post_type_names()
{
	// Get a list of user created custom post types
	$cpt_names = array_values(get_post_types([
		'public'   => true,
		'_builtin' => false
	]));

	// Add posts and pages to list
	array_unshift($cpt_names, 'post', 'page');
	return $cpt_names;
}

// Returns array of keys, values for post types.
// Keys = post type name
// Values = post type slug
function get_post_type_permalinks()
{
	$ptNames = get_post_type_names();
	$stuff = [];

	foreach ($ptNames as $ptName) :
		if ($ptName === 'page') {
			$stuff[$ptName] = "";
		} else if ($ptName === 'post') {
			// If post, get the first part of the default wordpress permalink structure
			$stuff[$ptName] = array_shift(array_filter(explode('/', get_option('permalink_structure'))));
		} else {
			// Must be custom post type, get the rewrite slug for it
			$pt_object = get_post_type_object($ptName);
			$stuff[$ptName] = $pt_object->rewrite['slug'];
		}
	endforeach;

	return $stuff;
}

// Returns the post type name from the slug
function get_post_type_name_from_slug($slug="")
{
	// Split the slug and get the first part
	$slug = explode('/', $slug)[0];
	$post_type_name = array_search($slug, get_post_type_permalinks());
	return $post_type_name;
}

function get_post_type_slugs()
{
	return array_values(array_filter(array_values(get_post_type_names())));
}

/*
 * Set the default preview fields for a post type
*/
add_action('registered_post_type', function ($post_type, $post_type_object) {
	if ($post_type_object->name === 'page') return;

	if (!get_option($post_type_object->name . '_preview_fields')) {
		update_option($post_type_object->name . '_preview_fields', 'ID, post_title, permalink, featured_image');
	}
}, 10, 2);


function get_custom_post_type_preview_fields($post_type)
{
	$optionsString = trim(get_option($post_type . '_preview_fields'));
	if (!$optionsString) return [];

	// Create an array from the comma separated list
	$values = array_filter(array_map(function ($str) {
		return trim($str);
	}, explode(',', $optionsString)));

	// Parse the prefixed nested values into their own array
	$nested_values = [];

	foreach ($values as $key => $str) {
		$boom = explode('.', $str);

		if (count($boom) > 1) {
			$nested_values[$boom[0]][] = $boom[1];
			unset($values[$key]);
		}
	}

	return array_merge($values, $nested_values);
}
