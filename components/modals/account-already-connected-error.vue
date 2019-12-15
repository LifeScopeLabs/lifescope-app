<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">{{ providerName }} Account Already Connected</span>

                <p class="align-center">
                    It looks like you just tried to make a new Connection to {{ providerName }} or reauthorize a Connection to {{ providerName }}.
                    The {{ providerName }} account you're signed into is already associated with another LifeScope account, and <i>not</i> this one, so we couldn't complete that action.
                    A {{ providerName }} account can only be associated with one LifeScope account.
                </p>

                <p class="align-center">
                    If you were trying to reauthorize an existing Connection, sign out of {{ providerName }}, then sign back in with the correct account and attempt the reauthorization again.
                </p>

                <p class="align-center">
                    If you were trying to make a new Connection, then you'll have to sign out of this LifeScope account, sign into the LifeScope account
                    associated with that {{ providerName }} account, delete the associated Connection, then log back into the LifeScope account you're currently
                    using and make the Connection.
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
