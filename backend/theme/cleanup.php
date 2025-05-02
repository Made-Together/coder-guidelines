<?php

// Disable gutenberg
add_filter('use_block_editor_for_post', '__return_false', 10);
add_filter( 'big_image_size_threshold', '__return_false' );

// Removes comments from admin menu
add_action( 'admin_menu', function() {
	remove_menu_page( 'edit-comments.php' );
});

// Removes comments from post and pages
add_action('init', function() {
	remove_post_type_support( 'post', 'comments' );
	remove_post_type_support( 'page', 'comments' );
}, 100);

// Removes comments from admin bar
add_action( 'wp_before_admin_bar_render', function() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu('comments');
});


add_action( 'after_setup_theme', function() {
	/**
   * Enable support for Post Thumbnails on posts and pages.
   *
   * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
   */
  add_theme_support( 'post-thumbnails' );
});
