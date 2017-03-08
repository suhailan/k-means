<style type="text/css">
 table{ text-align:center; font-size:12px};
</style>
<h1 style="line-height:40% ">K-Means</h1>
<p style="line-height:40%; font-style:normal">A K-Means algorithm.</p>
<h3 style="line-height:30% ">By Suhailan Safei (2015)</h3>
<h5 style="line-height:30% ">suhailan@unisza.edu.my</h5>
<hr>
<?php
require_once('class_kmeans.php');
require_once('graph.php');
$K = $_REQUEST['K'];//total number of cluster to be generated
if (strlen($K)==0){
	$K = 3;
}
$graph = new GRAPH();

$criteria =array ("CW","FINAL");
$alternativeid = array("ID1","ID2","ID3","ID4","ID5","ID6","ID7","ID8","ID9","ID10","ID11","ID12","ID13","ID14","ID15","ID16","ID17","ID18","ID19","ID20","ID21","ID22","ID23","ID24","ID25","ID26","ID27","ID28","ID29","ID30","ID31","ID32","ID33","ID34","ID35","ID36","ID37","ID38","ID39","ID40","ID41","ID42","ID43","ID44","ID45","ID46","ID47","ID48","ID49","ID50","ID51","ID52","ID53","ID54","ID55","ID56","ID57","ID58","ID59","ID60","ID61","ID62","ID63","ID64","ID65","ID66","ID67","ID68","ID69","ID70","ID71","ID72","ID73","ID74","ID75","ID76","ID77","ID78","ID79","ID80","ID81","ID82","ID83","ID84","ID85","ID86","ID87","ID88","ID89","ID90","ID91","ID92");
$alternative = array(
					array("27.5","23.33","22.5","27.5","16.67","28.33","22.5","21.67","27.5","29.17","28.33","28.33","25","30","30","30","26.67","30.83","24.17","29.17","23.33","28.33","29.17","36.67","27.5","32.5","31.67","26.67","25.83","30.83","29.17","20.83","30","30.83","30","30","30","32.5","30","30","31.67","33.33","30.83","35.83","27.5","31.67","33.33","27.5","32.5","30.83","35","35","34.17","25","32.5","33.33","33.33","30","35","32.5","32.5","39.17","30.83","30.83","34.17","35.83","29.17","28.33","30.83","27.5","31.67","26.67","28.33","27.5","29.17","32.5","29.17","34.17","35.83","32.5","32.5","33.33","31.67","34.17","33.33","32.5","40","36.67","35","33.33","40","40"), //CW
					array("8","14","17.5","13","24.5","13","20.5","21.5","16","14.5","16.5","17","21","16.5","16.5","16.5","20","16","23","18","24.5","20","20","13","22.5","17.5","18.5","23.5","24.5","20","22","30.5","21.5","22","23","23","23","20.5","23.5","23.5","22","20.5","23","18","26.5","22.5","21","27","22","24","20","20","21","30.5","23.5","24","24","27.5","22.5","26","26","19.5","28","28","25","23.5","30.5","31.5","29","33","29","34","32.5","33.5","32.5","29.5","33.5","29","28","31.5","31.5","31","35","32.5","34","35.5","29","32.5","36","38.5","41.5","42"), //FINAL
					);
$ITERATION_LIMIT = 15;

$kmeans = new KMEANS($K,$alternative);
$centroids1 = $kmeans->InitializeCentroids();
for ($i=0;$i<$ITERATION_LIMIT;$i++){
	$cluster =$kmeans->AssignCluster();	
	$centroids = $kmeans->UpdateCentroids();	
	if ($kmeans->status ==0 )
		break;	
}
?>
<form>
Number of clusters: <input type="text" name="K" value="<?php echo $K;?>">
<input type="submit" name="btn" value="Generate">
</form>

<table>
<tr>
<td>
<?php
echo "<p style='text-align:left'>Initial Centroids<p>";
$N = count($centroids1);
for ($k=0;$k<$K;$k++){
	$graph->color[$k];
	echo "<p style=\"color:".$graph->color[$k]."; line-height: 40%; text-align:left\"> Cluster-$k: ";
	for ($i=0;$i<$N;$i++){
		echo $centroids1[$k][$i]."&nbsp;&nbsp;";	
	}
	echo "<p>";
}
?>
</td><td>
<?php

echo "<p style='text-align:left'>Centroids (".$gkmeans->iteration." iterations)<p>";
$N = count($centroids);
for ($k=0;$k<$K;$k++){
	$graph->color[$k];
	echo "<p style=\"color:".$graph->color[$k]."; line-height: 40%; text-align:left\"> Cluster-$k: ";
	for ($i=0;$i<$N;$i++){
		echo $centroids[$k][$i]."&nbsp;&nbsp;";	
	}
	echo "<p>";
}
?>
</td></tr>
<tr><td>
<?php
echo "<table border=1><tr><th>ID</th>";
$C = count($alternative);
for ($j=0;$j<$C;$j++){
	echo "<th>".$criteria[$j]."</th>";
}
echo "<th>Sum</th><th>RANK</th><th>CLUSTER</th></tr>";	
$N = count($rank);				
for ($i=0;$i<$N;$i++){
	echo "<tr><td>".$alternativeid[$i]."</td>";
	$sum = 0;
	for ($j=0;$j<$C;$j++){
			echo "<td>".$alternative[$j][$i]."</td>";
			$sum += $alternative[$j][$i];
	}
	echo "<td>".$sum."</td>";
	echo "<td>".$rank[$i]."</td>";
	echo "<td>".$cluster[$i]."</td>";
	echo "</tr>";	
}
echo "</table>";
echo "</div>";
//$data = array_map(null, $alternativeid,$alternative,$cluster);
?>
</td>
<td  valign="top" align="center" >
<?php				
		$graph->SCATTER($alternativeid,$alternative,$cluster,$centroids,$K);
?>

</td>
</tr>
</table>
