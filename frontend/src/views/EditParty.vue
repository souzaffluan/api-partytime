<template>
    <div class="editparty">
        <h1>Edite sua Festa</h1>
        <PartyForm :party="party" page="editparty" btnText="Editar Festa" :key="componentKey" />
    </div>
</template>

<script>
import PartyForm from "../components/PartyForm.vue"

export default {
    components: {
        PartyForm
    },

    data() {
        return {
            party: {},
            componentKey: 0
        }
    },
    created() {

        this.getParty();
    },
    methods: {
        async getParty() {

            // pegar o id da url e o token da storage

            const id = this.$route.params.id;
            const token = this.$store.getters.token;

            await fetch(`http://localhost:3000/api/party/${id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "auth-token": token
                }
            })
                .then((resp) => resp.json())
                .then((data) => {

                    this.party = data.party;

                    this.party.partyDate = this.party.partyDate.substring(0, 10);

                    this.party.photos.forEach((photo, index) => {
                        photo = photo.replace(/\\/g, '/');

                        this.party.photos[index] = photo.replace('backend/public', 'http://localhost:3000');
                    });

                    

                    this.componentKey += 1;

                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}

</script>

<style scoped>
.editparty {
    text-align: center;
    padding-top: 40px;
    padding-bottom: 100px;
}

.editparty h1 {
    margin-bottom: 40px;
}
</style>