<?php
class GRAPH
{	
	public $color = array("green","blue","red","aqua","brown","fuchsia","indigo","greenyellow");	
	public $xstep = 5;
	public $ystep = 5;
    public function __construct()
    {		
	}
	
	public function SCATTER(array $id,array $features,array $cluster,array $centroids, $K){
		
		$N = count($id);
		$max_x = max($features[0])+10;
		$min_x = 0;//min($features[0]);
		$max_y = max($features[1])+10;
		$min_y = 0;//min($features[1]);
		echo "\n\n<div id='chart_div' style='float: left; margin-right: 20px;'></div>
				<div id='legend' style='float: left; margin-top: 20px;'></div>
			  <script src='js/chart.js' type='text/javascript'></script>";
		echo "<script>
			var c = new chart('chart_div', {
			type:'scatter', width: 450,height: 350,
			x_start: ".$min_x.",	x_end: ".$max_x.",	x_step: ".$this->xstep.",
			x_grid: '#e9e9e9',
			y_start: ".$min_y.", y_end: ".$max_y.",	y_step: ".$this->ystep.",
			y_grid: '#e9e9e9',
			backgroundColor: '#fff',	color: '#000',
			markers: true,	values: true,
			onclick: function(x,y, label){
				alert(label + '(' + x + ':' + y + ')');
			},
			onmouseover: function(x,y,label){
				var canv = document.getElementById('chart_div');
				canv.style.cursor = 'pointer';
				canv.style.cursor = 'hand';
				var l = document.getElementById('legend');
				l.innerHTML = '<p>x: ' + x + '; y: ' + y + '</p><p>Label: ' + label + '</p>';
			},
			onmouseout: function(x,y,label){
				var canv = document.getElementById('chart_div');
				canv.style.cursor = 'default';
				document.getElementById('legend').innerHTML = '';
			},
			on_error: function(){
				alert('Your browser does not support canvas. Upgrade your browser!');
			}
		});";		
		for ($i=0;$i<$N;$i++){
			$x = $features[0][$i];
			$y = $features[1][$i];
			$k = $cluster[$i];
			$name = $id[$i];
			echo "c.add(".$x.",".$y.",'".$this->color[$k]."', '".$name."');\n";
		}
		
		/*for ($k=0;$k<$K;$k++){
			$x = $centroids[$k][0];
			$y = $centroids[$k][1];
			$name = $k;
			echo "c.add(".$x.",".$y.",'black', 'Cluster-".$name."');\n";
		}*/
		
		echo "c.draw();";
		echo "</script>";
	}
}
?>
