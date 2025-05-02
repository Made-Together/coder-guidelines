<?php

function api_settings_page()
{
?>
	<div class="wrap">
		<h1>Together API Settings</h1>
		<form method="post" action="options.php">
			<?php
			settings_fields("section");
			do_settings_sections("api-settings");
			submit_button();
			?>
		</form>
	</div>
	<?php
}

function add_theme_menu_item()
{
	add_menu_page("API Settings", "API Settings", "manage_options", "api-settings", "api_settings_page", null, 99);
}

add_action("admin_menu", "add_theme_menu_item");



function display_api_settings()
{
	$cpt_names = get_post_type_names();

	add_settings_section("section", "Preview Fields", null, "api-settings");

	$defaults = [
		'post' => 'ID, post_title, permalink, featured_image, categories.categories, categories.tags, acf.preview_teaser, acf.preview_heading_override',
		'page' => 'ID, post_title, permalink, featured_image'
	];

	foreach ($cpt_names as $cpt_name) {
		$id = $cpt_name . "_preview_fields";
		add_settings_field(
			$id,
			$cpt_name,
			function () use ($id, $cpt_name, $defaults) {
				$value = !empty(get_option($id)) ? get_option($id) : ($defaults[$cpt_name] ?: $defaults['page']);
	?>
			<textarea name="<?= $id ?>" id="<?= $id ?>" style="min-height:120px; width:100%; max-width:600px"><?= $value ?></textarea>
<?php
			},
			"api-settings",
			"section"
		);

		register_setting("section", $id);
	}
}

add_action("admin_init", "display_api_settings");
