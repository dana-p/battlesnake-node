  var matrix = new Array(20);
  for (var i = 0; i < 20; i++) {
    matrix[i] = new Array(30);
    for(var j = 0; j < 30; j++){
      matrix[i][j] = 0;
    }
  }
  
  matrix[10][10] = -100; 
  matrix[10][11] = -100; 
  matrix[10][12] = -100; 
  
  matrix[15][10] = -100; 
  matrix[15][11] = -100; 
  matrix[15][11] = -100; 
  matrix[15][11] = -100; 
  
  matrix[16][11] = 200; 
  
  matrix = fillPriority(0,0, matrix); 
  
  function prettyPrint(matrix){
  
	  for (var i = 0; i < matrix.length; i++){
		mystring = ""; 
		for (var j = 0; j < matrix[i].length; j++){
			whitespace = "";  		
			if (matrix[i][j] >= 0 && matrix[i][j] < 100)
				whitespace = "   "; 
			if (matrix[i][j] >= 100)
				whitespace = " ";
		 mystring = mystring + whitespace + matrix[i][j] + ","; 
		}
		console.log("["+mystring+"]"); 
	  }
  }
  
  prettyPrint(matrix)
  
  
function fillPriority(firstval, secondval, m){
	//var head = s.coords[0];
	//firstval = head[0];
	//secondval = head[1];

	try{ 
		m[firstval-1][secondval] = 3;
	} catch (TypeError) {}; 
	
	try{ m[firstval+1][secondval] = 3; } catch (TypeError) {}; 
	try{ m[firstval][secondval-1] = 3; } catch (TypeError) {}; 
	try{ m[firstval][secondval+1] = 3; } catch (TypeError) {}; 
	
	try{ m[firstval-2][secondval] = 2; } catch (TypeError) {}; 
	try{ m[firstval+2][secondval] = 2; } catch (TypeError) {}; 
	try{ m[firstval][secondval-2] = 2; } catch (TypeError) {}; 
	try{ m[firstval][secondval+2] = 2; } catch (TypeError) {}; 
	try{ m[firstval-1][secondval-1] = 2; } catch (TypeError) {}; 
	try{ m[firstval+1][secondval+1] = 2; } catch (TypeError) {}; 
	try{ m[firstval+1][secondval-1] = 2; } catch (TypeError) {}; 
	try{ m[firstval-1][secondval+1] = 2; } catch (TypeError) {}; 
	
	try{ m[firstval-3][secondval] = 1; } catch (TypeError) {}; 
	try{ m[firstval+3][secondval] = 1; } catch (TypeError) {}; 
	try{ m[firstval][secondval-3] = 1; } catch (TypeError) {}; 
	try{ m[firstval][secondval+3] = 1; } catch (TypeError) {}; 
	
	try{ m[firstval-2][secondval+1] = 1; } catch (TypeError) {}; 
	try{ m[firstval-2][secondval-1] = 1; } catch (TypeError) {}; 
	try{ m[firstval+2][secondval+1] = 1; } catch (TypeError) {}; 
	try{ m[firstval+2][secondval-1] = 1; } catch (TypeError) {}; 
	
	try{ m[firstval-1][secondval+2] = 1; } catch (TypeError) {}; 
	try{ m[firstval+1][secondval+2] = 1; } catch (TypeError) {}; 
	try{ m[firstval-1][secondval-2] = 1; } catch (TypeError) {}; 
	try{ m[firstval+1][secondval-2] = 1; } catch (TypeError) {}; 
	

return m;
}