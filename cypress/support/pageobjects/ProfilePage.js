class ProfilePage{
    getMainProfileImage(){
        return cy.get('img').eq(0)
    }
}
export default ProfilePage