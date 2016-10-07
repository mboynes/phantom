<?php

add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'twentysixteen-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'broken-js-test-style', get_stylesheet_directory_uri() . '/style.css', [ 'twentysixteen-style' ] );
} );

add_action( 'wp_head', function() {
	?>
	<script type="text/javascript">
	// Deliberately trigger a js error
	thisShouldCauseAnError();
	</script>
	<?php
} );
