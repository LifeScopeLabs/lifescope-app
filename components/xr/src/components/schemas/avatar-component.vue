<!-- Avatar Template -->
<template>
    <!-- <a-entity/> 0.45 0.5 0.4 #efefef #000-->
    <a-entity class="avatar">
        <a-sphere class="head"
        color="#5985ff"
        scale="0.1 0.1 0.1"
        ></a-sphere>
        <a-entity class="face"
        position="0 0.05 0"
        >
        <a-sphere class="eye"
            color="#5985ff"
            position="0.16 0.1 -0.35"
            scale="0.12 0.12 0.12"
        >
            <a-sphere class="pupil"
            color="#5985ff"
            position="0 0 -1"
            scale="0.2 0.2 0.2"
            ></a-sphere>
        </a-sphere>
        <a-sphere class="eye"
            color="#5985ff"
            position="-0.16 0.1 -0.35"
            scale="0.12 0.12 0.12"
        >
            <a-sphere class="pupil"
            color="#5985ff"
            position="0 0 -1"
            scale="0.2 0.2 0.2"
            ></a-sphere>
        </a-sphere>
        </a-entity>
    </a-entity>
</template>

<script>
export default {
    methods: {
        createAvatarTemplate() {
            console.log("createAvatarTemplate");
            var at = document.createElement("template");
            at.id = "avatar-template";
            var avatar = document.createElement("a-entity");
            avatar.classList.add('avatar');
            var sphere = document.createElement("a-sphere");
            sphere.classList.add("head");
            sphere.style.color = "#5985ff";
            sphere.style.scale = "0.45 0.5 0.4";
            
            avatar.appendChild(sphere);
            at.appendChild(avatar);

            var assets = document.getElementsByClassName('assets-avatar')[0];
            //debugger;
            assets.appendChild(at);
        },
        addAvatarTemplate() {
            console.log("addAvatarTemplate");

            this.createAvatarTemplate();

            NAF.schemas.add({
                template: '#avatar-template',
                components: [
                    'position',
                    'rotation',
                    {
                    selector: '.head',
                    component: 'material',
                    property: 'color'
                    }
                ]
            });
        }
    },
    created () {
        console.log("avatar-component: created");
        // this.addAvatarTemplate();
    },
    mounted () {
        console.log("avatar-component: mounted");
        this.addAvatarTemplate();
    }
}
</script>