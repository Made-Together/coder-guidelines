<?php

add_action( 'add_attachment', 'fmt_update_media_title' );

function fmt_update_media_title( $id ) {
	$options = [
		"chk_hyphen"             => "1",
		"chk_underscore"         => "1",
		"rdo_cap_options"        => "cap_all"
	];
	$cap_options = $options['rdo_cap_options'];

	$uploaded_post_id = get_post( $id );
	$title = $uploaded_post_id->post_title;

	/* Update post. */
	$char_array = array();
	if ( isset( $options['chk_hyphen'] ) && $options['chk_hyphen'] ) {
		$char_array[] = '-';
	}
	if ( isset( $options['chk_underscore'] ) && $options['chk_underscore'] ) {
		$char_array[] = '_';
	}
	if ( isset( $options['chk_period'] ) && $options['chk_period'] ) {
		$char_array[] = '.';
	}
	if ( isset( $options['chk_tilde'] ) && $options['chk_tilde'] ) {
		$char_array[] = '~';
	}
	if ( isset( $options['chk_plus'] ) && $options['chk_plus'] ) {
		$char_array[] = '+';
	}

	/* Replace chars with spaces, if any selected. */
	if ( ! empty( $char_array ) ) {
		$title = str_replace( $char_array, ' ', $title );
	}

	/* Trim multiple spaces between words. */
	$title = preg_replace( "/\s+/", " ", $title );

	/* Capitalize Title. */
	switch ( $cap_options ) {
		case 'cap_all':
			$title = ucwords( $title );
			break;
		case 'cap_first':
			$title = ucfirst( strtolower( $title ) );
			break;
		case 'all_lower':
			$title = strtolower( $title );
			break;
		case 'all_upper':
			$title = strtoupper( $title );
			break;
		case 'dont_alter':
			/* Leave title as it is. */
			break;
	}

	// add formatted title to the alt meta field
	if ( isset( $options['chk_alt'] ) && $options['chk_alt'] ) {
		update_post_meta( $id, '_wp_attachment_image_alt', $title );
	}

	// update the post
	$uploaded_post               = array();
	$uploaded_post['ID']         = $id;
	$uploaded_post['post_title'] = $title;

	// add formatted title to the description meta field
	if ( isset( $options['chk_description'] ) && $options['chk_description'] ) {
		$uploaded_post['post_content'] = $title;
	}

	// add formatted title to the caption meta field
	if ( isset( $options['chk_caption'] ) && $options['chk_caption'] ) {
		$uploaded_post['post_excerpt'] = $title;
	}

	wp_update_post( $uploaded_post );
}
