class NavBarPage{
    getNavLinks(){
        return cy.get('nav ul > li > a')
    }

    getSignOutLink(){
        return this.getNavLinks().contains('Sign Out')
    }

    getNewArticleLink(){
        return this.getNavLinks().contains('New Article')
    }

    getSettingsLink(){
        return this.getNavLinks().contains('Settings')
    }
}
export default NavBarPage