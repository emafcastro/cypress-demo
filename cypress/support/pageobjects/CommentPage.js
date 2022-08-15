/// <reference types="cypress" />
class CommentPage {
    locators = {
        commentTextArea: "textarea",
        postButton: "Post Comment",
        deleteCommentButton: ".mod-options .ion-trash-a",
        editCommentButton: ".mod-options .ion-edit",
        saveCommentButton: "Save Comment",
    };

    getLastPostedComment() {
        return cy.get(this.locators.commentTextArea).eq(1);
    }

    typeComment(comment){
        cy.get(this.locators.commentTextArea).type(comment);
    }

    clickPostButton(){
        cy.contains(this.locators.postButton).click();
    }

    clickDeleteCommentButton(){
        cy.get(this.locators.deleteCommentButton).click();
    }

    verifyVisibilityOfComment(comment){
        cy.contains(comment).should("be.visible");
    }

    verifyConfirmationMessage(){
        cy.on("window:confirm", (text) => {
            expect(text).to.contains("Delete this comment?");
        });
    }

    clickEditCommentButton(){
        cy.get(this.locators.editCommentButton).click();
    }

    typeLastPostedComment(comment){
        this.getLastPostedComment().clear().type(comment);
    }

    clickSaveCommentButton(){
        cy.contains(this.locators.saveCommentButton).click();
    }

}
export const commentPage = new CommentPage();
