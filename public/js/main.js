$(document).ready(function(){
    
    
    
/*    Add extra password box
    $(document).on('click', "#signup", function(){
        console.log($("form input").length);
        if ($("form button").length == 2){
        $("#password").append('<div class="form-group" id="extraPass"><label for="password2">Reenter Password</label><input type="password" class="form-control" name="password2" id="password2" placeholder="Reenter password"></div>');
        }
        return false;
    });*/
        
    /*EDIT PROFILE*/
    $(document).on('click', "#profileRow .edit", function(){
        
        var textToBeEdited = $(this).parent().children(".profileInfo").html();
        
        //make new element
        var $toAdd = $("<textarea>", {class: "editingProfileInfo", style: "height: 100px; width: 100%"});
        $toAdd.html(textToBeEdited);
        
        //replace elements
        $(this).parent().children(".profileInfo").replaceWith($toAdd);
        
        //change edit button to say save
        $(this).removeClass("edit");
        $(this).addClass("save");
        $(this).html("Save");
        
    });
    
    
    /*SAVE PROFILE*/
    $(document).on('click', "#profileRow .save", function(){
        
        var textToBeSaved = $(this).parent().children(".editingProfileInfo").val();
        
        //make new element
        var $toAdd = $("<p>", {class: "profileInfo"});
        $toAdd.html(textToBeSaved);
        
        //replace elements
        $(this).parent().children(".editingProfileInfo").replaceWith($toAdd);
        
        //change edit button to say save
        $(this).removeClass("save");
        $(this).addClass("edit");
        $(this).html("Edit");
        
        var type = $(this).parent().attr("id");
        var datatoSend = {type: type, data: textToBeSaved};
        /*TO DO send AJAX to server to save about me*/
        $.ajax({
            url: "/save",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(datatoSend),
            contentType: "application/json",
            complete: function(){
                console.log("We have completed the transfer!");
            },
            success: function(data){
                console.log(data);
                console.log("Sucess!");
            },
            error: function(err){
                console.log("process error");
                console.log(err);
            }
        });
        
        
    });
    
});