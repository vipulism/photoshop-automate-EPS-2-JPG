#target photoshop  

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>EPS->JPG (Batch Processing)</name>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

 var dlgResource = "dialog { \
    text: 'EPS->JPG (Batch Processing)', \
    alignChildren: ['fill', 'top'],  \
    misc_settings: Panel { \
        margins:15, \
        alignChildrens:'left', \
        text: 'Misc Settings', \
        dpi: Group {\
            label: StaticText { text: 'DPI:',  preferredSize: [60,24] }, \
            value: EditText { text: '72', characters: 10, justify: 'right',  preferredSize: [140,24]} \
        },\
        quality: Group { \
            label: StaticText { text: 'Quality:',  preferredSize: [60,24] }, \
            value: Group { \
                alignChildren:'left', \
                orientation: 'stack' ,\
                edit: EditText { text: '60', justify:'right', preferredSize: [140,24] } \
            } \
        },\
   }, \
     q_picSettings: Panel { \
        orientation: 'row', \
        alignChildren: 'left', \
        margins:15, \
        text: 'Landscape Pictures', \
        widthLabel: StaticText { text: 'Width:',  preferredSize: [60,24] }, \
        widthValue: EditText { text: '1000', characters: 10, justify: 'right',  preferredSize: [140,24]} \
    }, \
    h_picSettings: Panel { \
        orientation: 'row', \
        alignChildren: 'left', \
        margins:15, \
        text: 'Portrait Pictures', \
        widthLabel: StaticText { text: 'Width:',  preferredSize: [60,24] }, \
        widthValue: EditText { text: '500', characters: 10, justify: 'right', preferredSize: [140,24]} \
    }, \
    qu_picSettings: Panel { \
        orientation: 'row', \
        alignChildren: 'left', \
        margins:15, \
        text: 'Quadratic Pictures', \
        widthLabel: StaticText { text: 'Width:',  preferredSize: [60,24] }, \
        widthValue: EditText { text: '500', characters: 10, justify: 'right',  preferredSize: [140,24]} \
   }, \
   bottomGroup: Group{ \
        btnOK: Button { text: 'Continue', properties:{name:'ok'}, size: [120,24], alignment:['left', 'center'] }, \
        btnCancel: Button { text: 'Cancel', properties:{name:'cancel'}, size: [120,24], alignment:['right', 'center'] }, \
    }\
}";

var dlg = new Window(dlgResource);
dlg.center();

/*
var quality_list = new Array('10', '20', '30', '40', '50', '60', '70', '80', '90', '100');

for(var i = 0; i < quality_list.length; i++){
	dlg.misc_settings.quality.value.list.add('item', quality_list[i]);
}

dlg.misc_settings.quality.value.edit.onChange = function() { dlg.misc_settings.quality.value.list.show(); }
dlg.misc_settings.quality.value.list.onChange = function () {dlg.misc_settings.quality.value.edit.text = list.selection.text;  }
*/

if ( 1 == dlg.show() ) {
    var inputFolder = Folder.selectDialog("Select the Folder with the EPS-Sourcefiles.");  
    var OutputFolder = Folder.selectDialog("Select the Folder in which the JPG-Targetfiles should be saved.");  
     
} else {
	alert('EPS->JPG\nBatch Processing canceled.');
}

if ( inputFolder != null && OutputFolder  != null ) {  

    // Makes list of all files located in that folder  
    var fileList = inputFolder.getFiles( "*.eps" );  

    // Create a EPS option object [height & width are doc size]  
    var eps_oo = new EPSOpenOptions();  

    eps_oo.antiAlias = true;  
    eps_oo.mode = OpenDocumentMode.RGB;
    eps_oo.constrainProportions = true;  
    eps_oo.resolution = (dlg.misc_settings.dpi.value.text) ? parseInt(dlg.misc_settings.dpi.value.text):72;
    
    // Open each file in turn  
    for (var i = 0; i < fileList.length; i++) {  

        // open the file once unmodified for getting the file constrains
        app.open( fileList[i], eps_oo );  
        
        var w = activeDocument.width;
        var h = activeDocument.height;
        
        activeDocument.close( SaveOptions.DONOTSAVECHANGES );  
        
        //modifiy settings for loading our scaled image
        eps_oo.constrainProportions = eps_oo.constrainProportions;
        eps_oo.resolution = eps_oo.resolution;
        
        //portrait
        if(w > h && dlg.q_picSettings.widthValue.text != "") {
            eps_oo.width = parseInt(dlg.q_picSettings.widthValue.text);
        //landscape
        } else if(w < h && dlg.h_picSettings.widthValue.text != "") {
            eps_oo.width = parseInt(dlg.h_picSettings.widthValue.text);
        } else if(w = h && dlg.qu_picSettings.widthValue.text != "") {
            eps_oo.width = parseInt(dlg.qu_picSettings.widthValue.text);            
        }
        
        // open the file again width our choosen width
        app.open( fileList[i], eps_oo);  

        var baseName = activeDocument.name.slice( 0,-4 );  

        // put your code to 'save as' the file here  
        var saveFile = new File ( OutputFolder + "/" + baseName + ".jpg" );  
        var quality = 60;
        
        if(dlg.misc_settings.quality.value.edit.text != "")  {
            quality = parseInt(dlg.misc_settings.quality.value.edit.text);
            quality = (quality >= 100) ? 100:quality;
            quality = (quality <= 0) ? 0:quality;
        }
    
        SaveForWeb(saveFile,quality); // set quality to suit  

        function SaveForWeb(saveFile,jpegQuality) {  
            var sfwOptions = new ExportOptionsSaveForWeb();   
            sfwOptions.format = SaveDocumentType.JPEG;   
            sfwOptions.includeProfile = false;   
            sfwOptions.interlaced = 0;   
            sfwOptions.optimized = true;   
            sfwOptions.quality = jpegQuality;  

            activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);  

        };    

        activeDocument.close( SaveOptions.DONOTSAVECHANGES );    

    };  

    alert('EPS->JPG\nBatch Processing successfully finished.');
 
};  