<?php
// add_action('publish_future_post', 'together_webhook_future_post', 10);
// add_action('publish_post', 'together_webhook_post', 10, 2);
// add_action('publish_page', 'together_webhook_post', 10, 2);
// add_action('post_updated', 'together_webhook_update', 10, 3);

// function together_webhook_future_post( $post_id ) {
//   together_webhook_post($post_id, get_post($post_id));
// }

// function together_webhook_update($post_id, $post_after, $post_before) {
//   together_webhook_post($post_id, $post_after);
// }

// function together_webhook_post($post_id, $post) {
// 	// Return on localhost as docker is sandboxed
// 	if (str_contains(get_home_url(), 'localhost'))
// 		return;

// 	if ($post->post_status === 'publish') {
// 		$ch = curl_init(get_home_url().'/api/revalidate/?url='.return_slug_from_post($post));
// 		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// 		curl_exec($ch);

// 		if (curl_errno($ch)) {
// 			$error_msg = curl_error($ch);
// 		}

// 		curl_close($ch);

// 		if (isset($error_msg)) {
// 			echo $error_msg;
// 		}
// 	}

// 	return;
// }

?>
