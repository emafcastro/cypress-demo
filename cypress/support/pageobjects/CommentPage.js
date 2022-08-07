class CommentPage{
    getCommentTextArea(){
        return cy.get('textarea')
    }
    
    getPostButton(){
        return cy.contains('Post Comment')
    }

    getDeleteCommentButton(){
        return cy.get('.mod-options .ion-trash-a')
    }

    getEditCommentButton(){
        return cy.get('.mod-options .ion-edit')
    }

    getLastPostedComment(){
        return this.getCommentTextArea().eq(1)
    }

    getSaveCommentButton(){
        return cy.contains('Save Comment')
    }
}
export default CommentPage