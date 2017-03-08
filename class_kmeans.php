<?php
class KMEANS
{
	public $K=1; 
	public $objects = array();
	public $totalFeatures=0;
	public $totalObjects=0;
	public $iteration=0;
	public $centroids = array();
	public $centroidsCurr = array();
	public $clusters = array();
	public $status = 1;
	public $nearestdistance = array();
	
    public function __construct($K)
    {
		$this->K = $K;				
    }
	
	public function SetAlternative(array $objects){
		$this->objects = $objects;
		$this->totalFeatures = count($objects);
		$this->totalObjects = count($objects[0]);
	}
		
	
	public function InitializeCentroids()
	{		
    $interval  =($this->totalObjects / $this->K);
		for ($k=0; $k < $this->K; $k++){			
			for ($d=0; $d < $this->totalFeatures; $d++){
        $i = ($k/$this->K)*$this->totalObjects + $interval;
				$this->centroids[$k][$d] = $this->objects[$d][$i];
			}						
		}
		$this->centroidsCurr = $this->centroids;
		return $this->centroids;
	}
	
	public function AssignCluster(){	
		//Calculate nearest distance among centroids
		$nearestdistance = array();
		for ($i=0; $i < $this->totalObjects; $i++)
		{
			for ($k=0; $k < $this->K; $k++)
			{
				$distance = 0;
				for ($j=0; $j < $this->totalFeatures; $j++){
					 $dist = $this->objects[$j][$i] - $this->centroids[$k][$j];
					 $distance +=  ($dist * $dist);
				}
				$distance = sqrt($distance);
				if ($k==0) {
					$lowest = $distance;
					$cluster = $k;					
				}
				else{
					if ($distance < $lowest){
						$cluster = $k;
						$lowest = $distance;
					}
				}
			}
			$nearestdistance[$i] = $lowest;
			$this->nearestdistance = $nearestdistance;
			$this->clusters[$i] = $cluster;
		}
		return $this->clusters;
	}
		
	public function UpdateCentroids(){
		//before update, assign current centroid to previous centroid
		$this->centroidsCurr = $this->centroids;
		
		//initialize centroid
		for ($k=0;$k< $this->K;$k++){			
			for ($d=0;$d<=$this->totalFeatures;$d++){
				$this->centroids[$k][$d] = 0;					
			}
		}
		//summing up centroid features
		$countObjectCluster = array();
		for ($k=0;$k< $this->K;$k++){
			$countObjectCluster[$k] = 0;
			for ($i=0;$i<$this->totalObjects;$i++){
				if ($this->clusters[$i] == $k){
					$countObjectCluster[$k]++;
					for ($d=0;$d<$this->totalFeatures;$d++){
						$this->centroids[$k][$d] = $this->centroids[$k][$d] + $this->objects[$d][$i];
					}
				}
			}
		}
		//calculate centroid average
		//initialize centroid
		for ($k=0;$k< $this->K;$k++){			
			for ($d=0;$d<$this->totalFeatures;$d++){
				$this->centroids[$k][$d] = $this->centroids[$k][$d] /$countObjectCluster[$k];//count ($this->centroids[$k][$d]);					
			}
		}
		//check status if all centroids no longer changed
		$new =serialize($this->centroids);
		$prev =serialize($this->centroidsCurr);
		if ($new == $prev) {
			$this->status = 0;
		}
		else $this->iteration++;			
		return $this->centroids;
	}		
}
