class NavBarPage{
    getNavLinks(){
        return cy.get('nav ul > li > a')
    }

    getSignOutLink(){
        return this.getNavLinks().contains('Sign Out')
    }
}
export default NavBarPage