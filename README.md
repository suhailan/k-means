# K-Means Algorithm

This sample codes will cluster 92 objects based on their similarities of attributes (i.e. alternative, criteria, dimension). This object consists TWO attributes; Course Work (CW) and Final Examination (Final) marks.

![alt tag](https://github.com/suhailan/k-means/blob/master/kmeans.jpg)


There are THREE main processes involved in the K-Means; Initial centroids selection, nearest cluster assignment, and centroids update.

a) Initial centroids selection
Centroid (m) is referring to a cluster centre that is represented using the feature points for a group of the nearby assigned objects. It is also used as a reference point in assigning objects into a cluster based on their nearest distance to the centroid. In the beginning of the assignment process, a number of K set of initial centroids need to be predetermined so that the objects can be assigned accordingly.
In basic K-Means, these initial centroids are randomly selected among objects. 

b) Nearest cluster assignment
Clustering process begins by measuring each object distance on each centroid (mk).

![alt tag](https://github.com/suhailan/k-means/blob/master/eq1.png)

where Sik is set of the object in cluster-k, k= 0 to K and d is a feature. The objects will be assigned to a cluster where they have the closest distance to the centroid. The distance measurement is using the Euclidean distance method; a typical K-Means nearest object measurement. 

c) Centroids update
This is the final step where once the objects have been re-assigned, the centroid for each cluster needs to be re-calculated.

![alt tag](https://github.com/suhailan/k-means/blob/master/eq2.png)

where M is the total of objects in cluster-k, k = 0 to K and d=0 to D. This step is to ensure that all objects that currently assigned to a cluster definitely belong to that cluster (i.e. nearest to its new assigned centroid) and far away from other clusters. If there is an object that turns out to be nearer to another centroid, then this object needs to be reassigned to the nearest cluster. Thus, iteratively, the whole process cycle starting from step (b) to (c) needs to be repeated until there are no changes to the centroids in all clusters.
