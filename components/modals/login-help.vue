<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="modal-close close-button" v-on:click="$emit('close')"></i>
        </div>

        <div class="body">
            <div class="paragraph" style="margin-bottom: 15px;">
                <h3>How do I sign up or log in?</h3>
                <p>LifeScope allows you to sign up or log in using any social service.</p>
                <p>Just click on any service, Connect to it, and authorize LifeScope to access your data.</p>

                <h3>Do I change authorization permissions when logging in?</h3>
                <p>No, your data authorizaiton selection for a service is not updated if you have already created an account. You must change your scope authorizaition choices in Menu > Settings > Connections.</p>

                <h3>Why don't all my Connections appear in the same account?</h3>
                <p>In order to associate multiple Connections with the same LifeScope account, you must be logged in to LifeScope and then must Connect those service providers from the 'Add Connections' page in the App Menu.</p>
                <p>If you sign up using one service, log out, then sign up using a different service, this will creating two separate LifeScope accounts.</p>
            </div>
        </div>
    </div>
</template>
