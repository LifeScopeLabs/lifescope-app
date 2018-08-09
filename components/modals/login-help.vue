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
                <p>Yes, your data authorizaiton selection for a service is updated every time you log in.</p>

                <h3>Why don't all my Connections appear in the same account?</h3>
                <p>In order to associate multiple Connections with the same LifeScope account, you must be logged in to LifeScope and then must Connect those service providers from the 'Add Connections' page in the App Menu.</p>
                <p>If you sign up using one service, log out, then sign up using a different service, we will have ended up creating two separate LifeScope accounts for you.</p>
            </div>
        </div>
    </div>
</template>
