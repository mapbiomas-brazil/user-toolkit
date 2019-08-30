# MapBiomas User Toolkit

**_João Siqueira_**

# About

user-toolkit is a repository for MapBiomas data access in Google Earth Engine

# How to use
<h4>1. Getting the code</h4>

You can acess the [repository](https://code.earthengine.google.com/?accept_repo=users/mapbiomas/user-toolkit) directly in Google Earth Engine. The scripts will appears at **Reader Session** of your scripts tab.

<h4>2. Create a MAPBIOMAS folder</h4>
<ul>
  <li>Go to the Assets tab and click on the New menu. Then choose a Folder option.</li>
  <li>Selects your primary account if you have others linked to your structure.</li>
  <li>Create a MAPBIOMAS folder (all capital letters) in your assets structure.</li>
</ul>
<img src="pictures/create-folder.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />

<h4>3. Upload a new table asset</h4>
<ul>
  <li>In GEE vectors are called tables.</li>
  <li>Access the menu New > Table upload to add a table.</li>
  <li>Press the SELECT button to choose your shapefile. Browse to the file on your computer.
  <li>Remember to use files with the extension .shp, .shx, .prj, and .bdf. Alternatively, you can compress them into a zip file to upload.
  <li>Note that you must enter the MAPBIOMAS folder name to add the file directly within this folder.</li>
  <li>Click on OK to start the upload task.</li>
</ul>
<img src="pictures/upload-table.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />
<ul>
  <li>The table will appear inside the MAPBIOMAS folder. Press the refresh button to view all your new files.</li>
  <li>You can also move/copy a table asset from elsewhere in your structure into the MAPBIOMAS folder.</li>
</ul>
<img src="pictures/tables-asset.png"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />

<h4>4. Accessing the data</h4>
<ul>
  <li>Now you run the script. Open the script in code editor and click on Run button.</li>
</ul>