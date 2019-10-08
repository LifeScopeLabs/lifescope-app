<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">{{ provider_name }} Account Doesn't Match</span>

                <p class="align-center">
                    It looks like you tried to reauthorize a Connection to {{ provider_name }}.
                    The {{ provider_name }} account you're currently signed into is not the one pair with that Connection, however, so we couldn't complete that action.
                    Sign out of {{ provider_name }}, then sign back in with the correct account and attempt the reauthorization again.
                </p>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
	    props: {
		    provider_name: {
			    type: String,
			    default: function() {
				    return '';
			    }
		    }
	    },
    }
</script>
