<?php

header("Access-Control-Allow-Origin: *");

add_filter('wp_rest_cache/allowed_endpoints', function ($allowed_endpoints) {
	if (!isset($allowed_endpoints['together'])) {
		$allowed_endpoints['together'][] = 'options';
		$allowed_endpoints['together'][] = 'redirects';
	}

	return $allowed_endpoints;
}, 10, 1);

add_action('rest_api_init', function () {

	// format values returned from the get_fields function
	add_filter('acf/format_value', 'format_acf_field_values', 10, 3);

	register_rest_route('together', 'get', [
		'methods' => 'POST',
		'callback' => 'together_get',
	]);

	register_rest_route('together', 'post', [
		'methods' => 'GET',
		'callback' => 'get_post_by_slug_rest_endpoint',
	]);

	register_rest_route('together', 'get_terms_by_post_type', [
		'methods' => 'POST',
    'callback' => 'together_get_terms_by_post_type',
	]);

	register_rest_route('together', 'paths', [
		'methods' => 'GET',
		'callback' => 'get_paths_for_rest_endpoint',
	]);

	register_rest_route('together', 'post_previews', [
		'methods' => 'GET',
		'callback' => 'get_post_preview_data',
	]);

	register_rest_route('together', 'preview', [
		'methods' => 'GET',
		'callback' => 'get_post_by_preview_rest_endpoint',
	]);

	register_rest_route('together', 'private', [
		'methods' => 'GET',
		'callback' => 'get_post_by_private_rest_endpoint',
	]);

	register_rest_route('together', 'robots', [
		'methods' => 'GET',
		'callback' => 'get_indexable_endpoint',
	]);

	register_rest_route('together', 'options', [
		'methods' => 'GET',
		'callback' => 'get_global_options',
	]);

	register_rest_route('together', 'redirects', [
		'methods' => 'GET',
		'callback' => 'get_redirects',
	]);

	register_rest_route('together', 'search', [
		'methods' => 'GET',
		'callback' => 'get_search_results',
	]);
});


function together_get($request) {
	$parameters = $request->get_json_params();
	unset($parameters['isListingPage']);

	$post_type = $parameters['post_type'] ?? ['post'];
	$posts_per_page = $parameters['posts_per_page'] ?? 8;
	$paged = $parameters['paged'] ?? 1;
	$taxonomies = $parameters['taxonomies'] ?? [];

	$tax_query = [];
	foreach ($taxonomies as $taxonomy => $terms) {
		$tax_query[] = [
			'taxonomy' => $taxonomy,
			'field'    => 'slug',
			'terms'    => $terms,
		];
	}

	$args = [
		'post_type'      => $post_type,
		'posts_per_page' => -1 // we are setting this to -1 so we can find out the total number of posts, then slicing the array
	];

	if (!empty($tax_query)) {
		$args['tax_query'] = $tax_query;
	}

	$allPosts = get_posts($args);
	$response = [
		'posts' => [],
		'total' => count($allPosts),
		'page' => [
			'current' => $paged,
			'total' => ceil(count($allPosts) / $posts_per_page)
		],
	];

	// slice the array by the paged and posts_per_page vars
	$response['posts'] = array_slice($allPosts, ($paged - 1) * $posts_per_page, $posts_per_page);

	// map over it to get the data we want
	$response['posts'] = array_map('get_post_preview_data_for_post', $response['posts']);

	return new WP_REST_Response($response);
}


function together_get_terms_by_post_type($request) {
	$post_type = $request['post_type'];
	$selectedTaxonomies = $request['selectedTaxonomies'] ?? [];
	$base_path = $request['base_path'] ?? '/';
  	$taxonomies = get_object_taxonomies($post_type, 'names');



  if (empty($taxonomies)) {
    return new WP_Error('no_taxonomies', 'No taxonomies associated with the specified post type', ['status' => 404]);
  }

  $all_terms = [];

  foreach ($taxonomies as $taxonomy) {
    $terms = get_terms([
      'taxonomy' => $taxonomy,
      'hide_empty' => true,
    ]);

    // Find if this taxonomy is in selectedTaxonomies and should prepend "All"
    $should_prepend_all = false;
    foreach ($selectedTaxonomies as $taxConfig) {
      if ($taxConfig['taxonomy_name'] === $taxonomy && $taxConfig['prepend_all_term']) {
        $should_prepend_all = true;
        break;
      }
    }

    // Only add terms and "All" option if terms exist and should prepend
    if (!empty($terms) && $should_prepend_all) {
      $all_terms[$taxonomy][] = [
        'id' => 'all',
        'name' => 'All',
        'url' => $base_path,
        'slug' => 'all',
      ];
    }

    foreach ($terms as $term) {
      $all_terms[$taxonomy][] = [
				'id' => $term->term_id,
				'name' => $term->name,
				'url' => strip_hostname_from_permalink(get_term_link($term)),
				'slug' => $term->slug,
			];
    }
  }

  if (empty($all_terms)) {
    return new WP_Error('no_terms', 'No terms found for the associated taxonomies', ['status' => 404]);
  }

  return new WP_REST_Response($all_terms, 200);
}


/**
 * Remove empty values from array recursively
 */
function clean_array(array $array) {
	$cleaned_array = [];

	foreach ($array as $key => $value) {
		if(is_object($value)) {
			// convert value to array
			$value = (array) $value;
		}

		if (is_array($value)) {
				$value = clean_array($value);
				if (!empty($value)) {
					$cleaned_array[$key] = $value;
				}
		} else {
			if (isset($value) && !empty($value) && $value !== "" && $value !== null) {
				$cleaned_array[$key] = $value;
			}
		}
	}

	return $cleaned_array;
}

function format_acf_field_values($value, $post_id, $field)
{
	// remove superfluous image data
	if ($field['type'] === 'image' && !empty($value) && isset($value['sizes'])) {

		// try to find a better alt value if it doesn't exist
		if (empty($value['alt'])) {
			// try to use the description
			if (!empty($value['description'])) {
				$value['alt'] = $value['description'];
			}

			// if the value is still empty, try to use the caption
			if (empty($value['alt'])) {
				$value['alt'] = $value['caption'];
			}

			if (empty($value['alt'])) {
				// if the value is STILL empty, just use the title
				$value['alt'] = $value['title'];
			}
		}

		foreach (['id', 'date', 'name', 'sizes', 'icon', 'link', 'uploaded_to', 'filename', 'status', 'menu_order', 'author', 'ID', 'subtype', 'type', 'modified', 'filesize', 'mime_type', 'description', 'caption', 'title'] as $key) {
			unset($value[$key]);
		}
	}

	if ($field['label'] === 'Block') {
		$value->acf = get_fields($value);
		$value->featured_image = get_the_post_thumbnail_url($value);
		return $value;
	}

	// Single post object
	if ($field['type'] === 'post_object' && !empty($value)) {
		$value = get_post_preview_data_for_post($value);
	}

	// Multiple post objects
	if ($field['type'] === 'relationship' && !empty($value)) {
		$value = array_map('get_post_preview_data_for_post', $value);
	}

	return $value;
}

function strip_hostname_from_permalink($permalink)
{
	return parse_url($permalink, PHP_URL_PATH);
}

// Get slug from post
function return_slug_from_post($post)
{
	$permalink = get_permalink($post);

	$path = strip_hostname_from_permalink($permalink);
	return $path !== '/' ? $path : '';
}

function return_slug_from_category($cat)
{
	return strip_hostname_from_permalink(get_category_link($cat));
}

function get_paginated_category_pages($cat)
{
	if ($cat->slug === 'uncategorized') return [];

	$slug = return_slug_from_category($cat);
	$count = $cat->count;

	$perPage = 9;
	$pagiPagesCount = $count / $perPage;
	$pagiPages = [];

	for ($i = 2; $i < $pagiPagesCount; $i++) {
		$pagiPages[] = $slug . $i . '/';
	}

	return $pagiPages;
}

function get_paths_for_rest_endpoint($request)
{
	$postsTypes = array_filter(get_post_type_slugs(), function ($postType) {
		// Use this function to remove post types from the initial prerender
		return true;
	});

	$paths = get_posts([
		'posts_per_page' => -1,
		'post_type' => $postsTypes,
		'suppress_filters' => 0,
	]);

	$arrayOfPaths = array_values(array_filter(array_map('return_slug_from_post', $paths)));
	$resourcePaths = [];

	foreach ([get_categories(['hide_empty' => true]), get_terms('industry', ['hide_empty' => true])] as $cats) {
		if (!is_a($cats, 'WP_Error')) {
			$resourcePaths = array_merge($resourcePaths, array_map('return_slug_from_category', $cats));
			// Get paths for paginated categories
			foreach ($cats as $c) {
				$resourcePaths = array_merge($resourcePaths, get_paginated_category_pages($c));
			}
		}
	}

	return new WP_REST_Response(array_merge($resourcePaths, $arrayOfPaths));
}

// Get all posts by slug endpoint
function get_post_by_slug_rest_endpoint($request)
{
	$slug = $request->get_param('slug');
	$array_of_slug_parts = array_values(array_filter(explode('/', $slug)));
	$post = null;
	$parsed_post = (object) [];

	// check to see if is a nested slug
	if (count($array_of_slug_parts) > 1) {
		// check to see if the first part of the slug matches any custom post type slugs

		// get the post type name from the post type slug
		$post_type_name = get_post_type_name_from_slug($array_of_slug_parts[0]);

		if (!empty($post_type_name)) {

			// strip the post type part from the slug and create a string from the rest of the slug
			$rest_of_slug = implode('/', array_slice($array_of_slug_parts, 1));
			// get the post by passing the rest of slug, using the post type name as the post type to look for
			$post = get_page_by_path($rest_of_slug, OBJECT, [$post_type_name]);
		}
	}

	// if still no post, must be a page
	if (!$post) {
		$post = get_page_by_path($slug, OBJECT, ['page']);
	}

	// check if is a category or taxonomy page
	if (empty($post) && count($array_of_slug_parts) > 2) {
		$taxonomy = $array_of_slug_parts[1];
		$term_slug = end($array_of_slug_parts);
		$post = get_term_by('slug', $term_slug, $taxonomy);
		if (is_a($post, 'WP_Term')) {
			// Make the term object look more like a normal post
			$post->post_title = $post->name;
			$post->post_name = $post->slug;
			$post->post_type = $taxonomy;
			$post->post_status = 'publish';
			$post->ID = $post->term_id;
			$post->url = get_term_link($post);
		}
	}

	// don't send the post if it's not published or found
	if (!$post ||  $post->post_status !== 'publish') {
		return new WP_REST_Response([
			'error' => 'Post not found'
		], 404);
	}

	$parsed_post = include_rest_data_for_post($post);
	return new WP_REST_Response($parsed_post);
}

function get_post_preview_data(WP_REST_Request $data)
{
	$postType = $data->get_param('post_type');
	$postsPerPage = $data->get_param('posts_per_page');
	$posts = get_posts([
		'post_type' => $postType,
		'posts_per_page' => $postsPerPage ?: -1,
	]);

	$mappedPosts = [];
	foreach ($posts as $post) {
		$mappedPosts[] = get_post_preview_data_for_post($post);
	}

	return new WP_REST_Response($mappedPosts);
}

function get_post_featured_image($post, $width = 760, $height = 460)
{
	$src = wp_get_attachment_image_src(get_post_thumbnail_id($post), 'full', true)[0];
	if (str_contains($src, 'images/media/default.png')) {
		$src = '';
	}

	return [
		'src' => $src ?? '',
		'width' => $width,
		'height' => $height,
		'alt' => get_post_meta(get_post_thumbnail_id($post), '_wp_attachment_image_alt', true),
	];
}

function get_post_author_data($post)
{
	if (!$post['post_author']) {
		return [];
	}

	return [
		'name' => get_the_author_meta('first_name', $post['post_author']) . ' ' . get_the_author_meta('last_name', $post['post_author']),
		'acf' => get_fields('user_' . $post['post_author']),
	];
}


function calculate_read_time($post)
{
	// Initialize the read time variable
	$readTime = 0;

	// String used to collect all text content
	$content = '';

	// Get the "article_content" field
	$articleContent = get_field('article_content', $post->ID);

	if ($articleContent && is_array($articleContent) && !empty($articleContent)) {
		foreach ($articleContent['article_renderer'] as $block) {
			// Check if the block is a "content" block
			if (isset($block['acf_fc_layout']) && $block['acf_fc_layout'] === 'text_content') {
				// Concatenate the content from all "content" blocks
				$content .= $block['text_content'];
			}
		}

		// Calculate the read time based on word count and reading speed
		$wordCount = str_word_count(strip_tags($content));
		$readingSpeed = 225; // Words per minute
		$readTime = ceil($wordCount / $readingSpeed);
	}

	return $readTime;
}


function get_post_preview_data_for_post($post)
{
	$postType = $post->post_type;
	$postTypeFields = get_custom_post_type_preview_fields($postType);
	$mappedPost = [];

	foreach ($postTypeFields as $key => $field) {
		if ($field === 'post_date_gmt') {
			// Format dates
			$mappedPost[$field] = date_format(date_create($post->post_date_gmt), 'jS M Y');
		} elseif ($key === 'acf') {
			// Get specified ACF fields
			$mappedPost['acf'] = [];
			foreach ($postTypeFields['acf'] as $acfField) {
				$mappedPost['acf'][$acfField] = get_field($acfField, $post->ID);
			}
		} elseif ($field === 'permalink') {
			// Get post permalink
			$mappedPost['permalink'] = return_slug_from_post($post);
		} elseif ($field === 'read_time') {
			$readTime = calculate_read_time($post);
			$mappedPost['read_time'] = $readTime;
		} elseif ($field === 'author') {
			// Get post author
			$mappedPost['author'] = get_post_author_data((array) $post);
		} elseif ($field === 'featured_image') {
			// Get post featured image
			$mappedPost['featured_image'] = get_post_featured_image($post);
		} elseif ($key === 'categories') {

			foreach ($field as $taxonomy) {
				if (!empty($post)) {
					if ($taxonomy === 'categories') {
						$cats = wp_get_post_categories($post->ID, 'category');
						$mappedPost[$taxonomy] = array_map(function ($c) {
							$cat = get_category($c);
							return [
								'id' => $c,
								'name' => $cat->name,
								'slug' => $cat->slug,
							];
						}, $cats);
					} else {
						$customTaxonomy = wp_get_object_terms($post->ID, $taxonomy);
						$mappedPost[$taxonomy] = array_map(function ($customTaxonomyItem) {
							return [
								'id' => $customTaxonomyItem->term_id,
								'name' => $customTaxonomyItem->name,
								'slug' => $customTaxonomyItem->slug,
							];
						}, $customTaxonomy);
					}
				}
			}
		} else {
			$mappedPost[$field] = $post->$field;
		}
	}

	$mappedPost = clean_array((array) $mappedPost);
	return $mappedPost;
}


function get_global_options()
{
	$options = get_fields('options');
	unset($options['redirects']);
	return new WP_REST_Response($options);
}

function get_redirects()
{
	return new WP_REST_Response(get_field('redirects', 'options'));
}

function get_search_results(WP_REST_Request $request)
{
	$query = $request->get_param('q');
	$postType = $request->get_param('post_type') ?: 'post';
	$perPage = $request->get_param('per_page') ?: 20;

	$posts = [];

	if (!empty($query)) {
		$q = new WP_Query();
		$q->parse_query([
			'post_type' => $postType,
			's' => $query,
			'posts_per_page' => $perPage,
		]);

		if (function_exists('relevanssi_do_query')) {
			$__posts = relevanssi_do_query($q);
		} else {
			$__posts = $q->get_posts();
		}

		foreach ($__posts as $post) {
			$posts[] = get_post_preview_data_for_post($post);
		}
	}

	return new WP_REST_Response($posts);
}

// Get Preview endpoint
function get_post_by_preview_rest_endpoint($request)
{
	$maybe_post_id = $request->get_param('post_id');
	$data = [];
	if ($maybe_post_id) {
		$maybe_posts = get_posts([
			'post_status' => 'any',
			'post_parent' => intval($maybe_post_id),
			'post_type' => 'revision',
			'sort_column' => 'ID',
			'sort_order' => 'desc',
			'posts_per_page' => 1,
		]);
		if ($maybe_posts && count($maybe_posts) > 0) {
			$maybe_posts[0]->post_author = get_post($maybe_post_id)->post_author;
			$data = include_rest_data_for_post($maybe_posts[0]);
		}
	}
	return new WP_REST_Response($data);
}

// Get Private endpoint
function get_post_by_private_rest_endpoint($request)
{
	$maybe_post_id = $request->get_param('post_id');
	$key = $request->get_param('key');
	if (!$key || $key !== "SOME_KEY") {
		return new WP_Error('invalid_key', "Invalid key used for private post");
	}
	$data = [];

	if ($maybe_post_id) {
		$maybe_post = get_post(intval($maybe_post_id));
		if ($maybe_post) {
			$data = include_rest_data_for_post($maybe_post);
		}
	}
	return new WP_REST_Response($data);
}

function parse_flexible_content_section($section, $sections, $key)
{
	$section['section']['acf_fc_layout'] = $section['acf_fc_layout'];

	// Add ACF fields and featured image to resources listing page
	if ($section['acf_fc_layout'] === 'archive_landing_page') {
		if ($section['post_type'] === 'resources') {
			$resourceLP = $section['resources_landing_page'];
			foreach ($resourceLP['featured']['featured_posts'] as $i => $postItem) {
				$resourceLP['featured']['featured_posts'][$i]['post'] = get_post_preview_data_for_post($postItem['post']);
			}

			foreach ($resourceLP['category_list'] as $i => $cat) {
				$posts = [];
				$catID = $cat['category_name'];

				foreach (get_posts(['post_type' => 'post', 'posts_per_page' => 6, 'category__in' => [$catID]]) as $p) {
					$posts[] = get_post_preview_data_for_post($p);
				}

				$resourceLP['category_list'][$i]['category_name'] = get_category($catID);
				$resourceLP['category_list'][$i]['category_permalink'] = get_category_link($catID);
				$resourceLP['category_list'][$i]['posts'] = $posts;
			}
		}
	}

	if (!empty($sections[$key - 1]['section'])) {
		$section['section']['previous_section'] = ['section' => $sections[$key - 1]['section']];
	}

	if (!empty($sections[$key + 1]['section'])) {
		$section['section']['next_section'] = ['section' => $sections[$key + 1]['section']];
	}

	return $section;
}

// Include additional data for when we return posts to rest api
function include_rest_data_for_post($post)
{
	// cast $post object to array
	$post = (array) $post;
	if (!isset($post['ID'])) return (object) [];

	// url/permalink
	$post['url'] = get_permalink($post['ID']);

	// ensure all content is wrapped in paragraphs
	$post['post_content'] = wpautop($post['post_content']);

	// template slug (if applicable)
	$post['template_slug'] = get_page_template_slug($post['ID']);

	// acf data
	$maybe_acf = function_exists('get_fields') ? get_fields($post['ID']) : null;

	if ($maybe_acf) {
		foreach ($maybe_acf as $key => $value) {
			if ($key === 'flexible_content') {
				// First we iterate over all sections to find "block" layouts, if is block layout, return the section inside the block post, else just return the section
				$sectionsWithBlocks = [];
				foreach ($value as $section) {
					$sectionsWithBlocks[] = $section['acf_fc_layout'] === 'block' ? get_field('flexible_content', $section['block'])[0] : $section;
				}

				// Then we parse $sectionsWithBlocks to determine stuff like previous/next section existance, background colors so the frontend can space sections nicely
				$flexibleSections = [];
				foreach ($sectionsWithBlocks as $flexibleKey => $flexibleValue) {
					$flexibleSections[] = parse_flexible_content_section($flexibleValue, $sectionsWithBlocks, $flexibleKey);
				}

				// Update the original $value with the parsed flexible sections
				$value = $flexibleSections;
			}


			// We will include all acf fields with the post
			// If there is overlap like if you name an acf field 'menu_order' it will
			// Come through as 'acf_menu_order'
			$post[isset($post[$key]) && $post[$key] ? 'acf_' . $key : $key] = $value;
		}
	}


	if ($post['post_type'] === 'post') {
		// Category data
		$cats = wp_get_post_categories($post['ID'], 'category');
		$post['categories'] = array_map(function ($c) {
			$cat = get_category($c);
			return [
				'id' => $c,
				'name' => $cat->name,
				'slug' => $cat->slug,
			];
		}, $cats);

		// Author data
		$post['author'] = get_post_author_data($post);
	}

	// Yoast Data
	$post['seo'] = [
		'title' => function_exists('YoastSEO') ? html_entity_decode(YoastSEO()->meta->for_post($post['ID'])->title) : $post['post_title'],
		'description' => function_exists('YoastSEO') ? html_entity_decode(YoastSEO()->meta->for_post($post['ID'])->description) : $post['post_excerpt'],
		'image' => '',
		'indexable' => '0', // 0 means yes according to yoast
	];

	$image = get_post_meta($post['ID'], '_yoast_wpseo_opengraph-image', true);
	if ($image) {
		$post['seo']['image'] = $image;
	} else if (!empty(get_post_featured_image($post['ID']))) {
		$featuredImage = get_post_featured_image($post['ID'])['src'];
		$post['seo']['image'] = empty($featuredImage) ? '' : $featuredImage;
	}

	$indexable = get_post_meta($post['ID'], '_yoast_wpseo_meta-robots-noindex', true);
	if ($indexable) {
		$post['seo']['indexable'] = $indexable;
	}

	// Fix for previews post type being revision
	if ($post['post_type'] === 'revision') {
		$post['post_type'] = get_post_type($post['post_parent']);
	}

	$post['featured_image'] = get_post_featured_image($post['ID']);

	$post = clean_array($post);
	return $post;
}

// Get Indexable Endpoint to determine robots.txt
function get_indexable_endpoint($request)
{
	return new WP_REST_Response([
		'blog_public' => (int) get_option('blog_public'),
	]);
}
