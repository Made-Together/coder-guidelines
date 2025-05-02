<?php

add_filter( 'preview_post_link', function( $link, $post ) {
	return next_get_preview_post_link($link, $post);
}, 11, 2 );

add_filter('page_link', "filter_url_for_next", 11, 2);
add_filter('post_link', "filter_url_for_next", 11, 2);

function filter_url_for_next($link, $post){
	if(is_int($post)){
		$post = get_post($post);
	}
	if($post->post_status === "private"){
		return next_get_private_post_link($link, $post);
	}
	$base_url = get_site_url();
	$replace_url = get_home_url();
	return str_replace($base_url, $replace_url, $link);
}

function next_get_preview_post_link($link, $post){
	$preview_url = get_home_url() . "/preview";
	if(!$preview_url) return $link;
	return $preview_url . "?post_id=" . $post->ID;
}

function next_get_private_post_link($link, $post){
	$private_url = get_home_url() . "/private";
	if(!$private_url) return $link;
	return $private_url . "?post_id=" . $post->ID . "&key=SOME_KEY";
}
