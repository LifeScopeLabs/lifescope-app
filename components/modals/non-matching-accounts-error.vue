<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">{{ providerName }} Account Doesn't Match</span>

                <p class="align-center">
                    It looks like you tried to reauthorize a Connection to {{ providerName }}.
                    The {{ providerName }} account you're currently signed into is not the one pair with that Connection, however, so we couldn't complete that action.
                    Sign out of {{ providerName }}, then sign back in with the correct account and attempt the reauthorization again.
                </p>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            providerName: {
                type: String,
                default: function() {
                    return '';
                }
            }
        },
    }
</script>
