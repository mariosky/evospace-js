//Programa principal
//Yovani Felix
//Figura[] Figuras = new Figura[200];


// Constants
int Y_AXIS = 1;
int X_AXIS = 2;

//Clase que crea la variable distance de la clase principal
class fig_distance
{
  int id;
  float distance;
  int color_;
  
  fig_distance(int temp_id,float temp_distance, int temp_color_)
  {
    id = temp_id;
    distance = temp_distance;
    color_ = temp_color_;
  }  
}


//Clase principal que contiene los atributos de la figura
abstract class Figura 
{
   float[] configuration;
   int id;  //identificador de cada figura
   float size_shape;  //tamaño de cada figura
   boolean follow, bandera;  //variable booleana para saber si puede seguir a otro
   PVector location;  //variable que tiene la posicion actual de la figura
   PVector velocity;  //variable de la velocidad de la figura
   color[] colors = new color[10]; // variable de color
   int c, contframe = 0; //variable de color
   float counter = 0; //variable auxiliar de contador
   float topspeed;
   fig_distance[] distance = new fig_distance[1000];  //arreglo que guarda el id de la figura y la distancia cuando estan una sobre otra
  
  Figura(int id_temp, int tam, float[] config) //constructor inicial de las variables
  {
    configuration = config;
    id = id_temp;
    size_shape = config[1];
    follow = false;
    location = new PVector(random(width),random(height));
    topspeed = random(1,5);
    //velocity = new PVector(0,0);
    //acceleration = new PVector(-0.001,0.01);
    velocity = new PVector(random(-1,1),random(-1,1));
    for(int i = 0;i < distance.length; i++) {distance[i] = new fig_distance(-1, 0.0, 0);}
//------------------------------una paleta de colores-------------------------------------------
      colors[0] = color(#B29253);
      colors[1] = color(#B29253);
      colors[2] = color(#07FF7F);
      colors[3] = color(#07FF7F);
      colors[4] = color(#FFAD10);
      colors[5] = color(#FFAD10);
      colors[6] = color(#A661CC);
      colors[7] = color(#A661CC);
      colors[8] = color(#7402B2);
      colors[9] = color(#7402B2);
  }
 
  void update(Figura[] Figuras)  //metodo de actualizacion de los valores de las figuras, recibe todos los valores del arreglo principal
  {
    float dis = 0;
    start_distance();  //metodo para inicializar id y distancias en cada tiempo
    PVector newlocation = new PVector(0,0);
    PVector newvelocity = new PVector(0,0);
    int ind = 0;
    if((frameCount == 1) && (configuration[10] == 0)){
      move0();
    }
    else if((frameCount == 1) && (configuration[10] == 1)){
      move1();
    }
    else if((frameCount == 1) && (configuration[10] == 2)){
      move2();
    }
    for(int i = 0 ;i < Figuras.length; i++)  //ciclo para comparar la figura actual con todas las demas
    {
      if (this.id != i)  //condicion para no tomar encuenta la comparacion con la misma figura
      {
        if(this.intersect(Figuras[i]))  //metodo para comparar si hay interseccion de la figura actual con alunas otras del arreglo
          {
            this.follow = true;
            this.distance[ind].id = i; 
            this.distance[ind].distance = this.location.dist(Figuras[i].location);
            dis = this.location.dist(Figuras[i].location);
            this.distance[ind].color_ = buscar_color(dis,size_shape);
            if(configuration[6] == 1.0){
              c = this.distance[ind].color_;
            } 
            if(configuration[7] == 1.0){          
              if((this.id < Figuras[i].id))
              {
             //------------------calcula la aproximacion de las figuras---------------------------------
                newlocation.add(this.velocity); newlocation.sub(Figuras[i].velocity);  
                newlocation.mult(0.015);  
                this.velocity.sub(newlocation);        
              }
            }
            ind ++;   
          }
          else {
            this.follow = false;
          }  //pone en falso la variable que follow       
        } 
      }    //-----------------------evaluacion de los movimientos-----------------------------------------------------
      if(configuration[8] == 0.0){
        Constrain_to_surface();
      }
      else if(configuration[8] == 1.0){
        if(configuration[10] == 0.0){
          if(this.location.x > width){
            this.location.x  = width/2;
            this.location.y  = height/2;
            velocity = new PVector(random(-1,1),random(-1,1)); 
            
          }
          if(this.location.x < 0){
            this.location.x  = width/2;
            this.location.y  = height/2;
            velocity = new PVector(random(-1,1),random(-1,1));
          }
          if(this.location.y > height){
            this.location.y  = height/2;
            this.location.x  = width/2;
            velocity = new PVector(random(-1,1),random(-1,1));
          }
          if(this.location.y < 0){
           this.location.y  = height/2;
           this.location.x  = width/2;
           velocity = new PVector(random(-1,1),random(-1,1));
         }
       }
       else if(configuration[8] == 1.0){
         if(configuration[10] == 1.0){
           if(this.location.x > width){
             this.location.y = (height / 2);
             this.location.x = random (1,width);
           }
           if(this.location.x < 0){
             this.location.y = (height / 2);
             this.location.x = random (1,width);
           }
           if(this.location.y > height){
             this.location.y = (height / 2);
             this.location.x = random (1,width);
           }
           if(this.location.y < 0){
             this.location.y = (height / 2);
             this.location.x = random (1,width);
           }
         }
       else if(configuration[8] == 1.0){
         if(configuration[10] == 2.0){
           if(this.location.x > width){
             this.location.x = (width / 2);
             this.location.y = random (1,height);
           }
           if(this.location.x < 0){
             this.location.x = (width / 2);
             this.location.y = random (1,height);
           }
           if(this.location.y > height){
             this.location.x = (width / 2);
             this.location.y = random (1,height);
           }
           if(this.location.y < 0){
             this.location.x = (width / 2);
             this.location.y = random (1,height);
           }
         } 
       else if(configuration[8] == 1.0){
         if(configuration[10] == 3.0){
           if(this.location.x > width){
             this.location.x = this.location.x - this.location.x;            
           }
           if(this.location.x < 0){
             this.location.x = width;
           }
           if(this.location.y > height){
             this.location.y = 0;
           }
           if(this.location.y < 0){
             this.location.y = height;
           }
         } 
       }
     }  
   }
 } 
 velocity.limit(topspeed);
 location.add(velocity);  //agrega velocidad a la localizacion actual 
}
  //Se limita la simulacion a un espacio
  void Constrain_to_surface()
  {
    if ((this.location.x > width) || (this.location.x < 0)) {  
    this.velocity.x = this.velocity.x * -1;
    }
    if ((this.location.y > height) || (this.location.y < 0)) {
      this.velocity.y = this.velocity.y * -1;
    }
  }
  
  void Constrain_to_surface2()
  {
    if(this.location.x > width){
      this.location.x  = 0;
      this.location.y  = 0;
    }
    if(this.location.x < 0){
      this.location.x  = width;
    }
    if(this.location.y > height){
      this.location.y  = 0;
    }
    if(this.location.y < 0){
      this.location.y  = height;
    }
  } 
 //metodo que cambia de color las figuras 
  void highlight() 
  {
    if(configuration[6] == 0){
      if(configuration[11] == 0){
        stroke(colors[c]);
      }
      if(configuration[11] == 1.0){
        fill(colors[c + 1]);
        stroke(colors[c + 1]);
      }
    }
    if(configuration[6] == 1.0){
      if(configuration[11] == 0){
        stroke(colors[c]);
      }
      if(configuration[11] == 1.0){
        fill(colors[c]);
        stroke(colors[c]);
      }
    }
    if(configuration[6] == 2.0){
      c--;
      if(configuration[11] == 0){
        stroke(c);
      }
      if(configuration[11] == 1.0){
        fill(c - 80);
        stroke(c - 80);
      }
    }
    if(configuration[6] == 3.0){
      c = (c + 1) % 256;
      if(configuration[11] == 0){
        stroke(c,255,c,100);
      }
      if(configuration[11] == 1.0){
        fill(c,255,255,100);
        stroke(c,255,255,100);
      }
    }
    if(configuration[6] == 4.0){
      c = (c + 1) % 256;
      if(configuration[11] == 0){
        stroke(c,20);
      }
      if(configuration[11] == 1.0){
        fill(c,100);
        stroke(c,100);
      }
    }
  }
  //------------------metodo que identifica si hay sobreposicion---------------
  boolean intersect(Figura Figuras) 
  {
    float distance = this.location.dist(Figuras.location); 
    if (distance < ((this.size_shape/2)+(Figuras.size_shape/2))) 
    {  
      return true;
    } 
    else 
    {
      return false;
    }
  }
  //-------------------funcion de movimientos iniciales-----------------------------
  void move0()
  {
    this.location.x = (width / 2);
    this.location.y = (height / 2); 
    velocity = new PVector(random(-2,2),random(-2,2));
  }
  
  void move1()
  {
    this.location.y = (height / 2);
    this.location.x = random (1,width);  
  }
  void move2()
  {
    this.location.x = (width / 2);
    this.location.y = random (1,height);  
  }
  
   //metodo que inicializa el arreglo de id y distancias
  void start_distance() 
  {
    for(int i = 0;i < distance.length; i++)
    {this.distance[i].id = -1; this.distance[i].distance = 0.0;}
  }
  
  int buscar_color(float dis, float size)
  {
    
    int col = 0;
    float porcentaje = 0;
    porcentaje = ((dis * 100) / (size));
    if((porcentaje <= 100) && (porcentaje >= 91)){
      return  9;
    }
    else if((porcentaje <= 90) && (porcentaje >= 81)){
      return  8;
    }
    else if((porcentaje <= 80) && (porcentaje >= 71)){
      return  7;
    }
    else if((porcentaje <= 70) && (porcentaje >= 61)){
      return  6;
    }
    else if((porcentaje <= 60) && (porcentaje >= 51)){
      return  5;
    }
    else if((porcentaje <= 50) && (porcentaje >= 041)){
      return  4;
    }
    else if((porcentaje <= 40) && (porcentaje >= 31)){
      return  3;
    }
    else if((porcentaje <= 30) && (porcentaje >= 21)){
      return  2;
    }
    else if((porcentaje <= 20) && (porcentaje >= 11)){
      return  1;
    }
    else{
      return  0;
    }
  }
  //-------------------funcion de rotacion---------------------------------------
  void rotate2D(PVector v, float theta) {
    float m = v.mag();
    float a = v.heading2D();
    a += theta;
    v.x = m * cos(a);
    v.y = m * sin(a);
  }
  
  abstract void display(Figura[] Figuras);

}

//Clase circulo que hereda las propiedades de la clase figura
class Circulo extends Figura
{
  Circulo(int id_temp, int tam, float[] config)
  {
    super(id_temp, tam, config);
  }
  void update(Figura[] Figuras)
  {
    super.update(Figuras);
  }
  
  void display(Figura[] Figuras) //metodo que dibuja las figuras
  {
    if(configuration[4] == 1.0){
      if(configuration[5] == 1.0){
        for(int i = 0 ;i < Figuras.length; i++){  //ciclo para comparar la figura actual con todas las demas
          if (this.id != i){  //condicion para no tomar encuenta la comparacion con la misma figura
            if(this.intersect(Figuras[i])){  //metodo para comparar si hay interseccion de la figura actual con alunas otras del arreglo
              highlight();
              ellipse(this.location.x,this.location.y,size_shape,size_shape);
            }
          }
        }
      }
      else{
          highlight();
          ellipse(this.location.x,this.location.y,size_shape,size_shape);
      }
    }   
  }
}

class Cuadro extends Figura
{
  Cuadro(int id_temp, int tam, float[] config){
    super(id_temp, tam, config);
  }
  void update(Figura[] Figuras){
    super.update(Figuras);
  }
  
  void display(Figura[] Figuras) //metodo que dibuja las figuras
  {   
    if(configuration[5] == 1.0){
      for(int i = 0 ;i < Figuras.length; i++){  //ciclo para comparar la figura actual con todas las demas
        if (this.id != i){  //condicion para no tomar encuenta la comparacion con la misma figura
          if(this.intersect(Figuras[i])){  //metodo para comparar si hay interseccion de la figura actual con alunas otras del arreglo
            highlight();                      
            rectMode(CENTER);
            if(configuration[9] == 1.0){
              pushMatrix();
                translate(this.location.x, this.location.y);
                rotate(counter*TWO_PI/360);
                rect(0,0,this.size_shape,this.size_shape);
                //line(this.location.x,this.location.y,Figuras[i].location.x,Figuras[i].location.y);
              popMatrix();
              counter++; 
            }
            else{
              highlight();
              rect(this.location.x,this.location.y,this.size_shape,this.size_shape);
              //line(this.location.x,this.location.y,Figuras[i].location.x,Figuras[i].location.y);
            }
          }
        }
      }
    }
    if(configuration[5] == 0){                  
            rectMode(CENTER);
            if(configuration[9] == 1.0){
              pushMatrix();
                translate(this.location.x, this.location.y);
                rotate(counter*TWO_PI/360);
                highlight();
                rect(0,0,this.size_shape,this.size_shape);
              popMatrix();
              counter++;; 
            }
            else{
              highlight();
              rect(this.location.x,this.location.y,this.size_shape,this.size_shape);
            }
    }
  }
}
class Triangule extends Figura
{
  float radio = 0;
  float theta = 120;
  PVector a = new PVector(0,0);
  PVector b = new PVector(0,0);
  PVector C = new PVector(0,0);
  
  Triangule(int id_temp, int tam, float[] config)
  {
    super(id_temp, tam, config);  
  }
  void update(Figura[] Figuras)
  {
    super.update(Figuras);
  }
  
  void display(Figura[] Figuras) //metodo que dibuja las figuras
  {
    if(configuration[5] == 1.0){
      for(int i = 0 ;i < Figuras.length; i++){  //ciclo para comparar la figura actual con todas las demas
        if (this.id != i){  //condicion para no tomar encuenta la comparacion con la misma figura
          if(this.intersect(Figuras[i])){  //metodo para comparar si hay interseccion de la figura actual con alunas otras del arreglo
            radio = (size_shape * 2.3)/4;
            a.x = location.x;
            a.y = location.y - radio;
            b.x = (location.x - (radio * cos(theta)));
            b.y = (location.y + (radio * sin(theta)));
            C.x = (location.x + (radio * cos(theta)));
            C.y = (location.y + (radio * sin(theta)));
            if((configuration[9] == 1.0)){
              pushMatrix();
                translate(this.location.x,this.location.y);
                rotate(counter*TWO_PI/360);
                translate(this.location.x * (-1),this.location.y * (-1));
                highlight();
                triangle(this.a.x,this.a.y,this.b.x,this.b.y,this.C.x,this.C.y);
              popMatrix();
              counter = counter + 1;
            }
            else{
              highlight();
              triangle(this.a.x,this.a.y,this.b.x,this.b.y,this.C.x,this.C.y);
            }
          }
        }
      }
    }
    if(configuration[5] == 0){
      radio = (size_shape * 2.3)/4;
      a.x = location.x;
      a.y = location.y - radio;
      b.x = (location.x - (radio * cos(theta)));
      b.y = (location.y + (radio * sin(theta)));
      C.x = (location.x + (radio * cos(theta)));
      C.y = (location.y + (radio * sin(theta)));
      if(configuration[9] == 1.0){
        pushMatrix();
          translate(this.location.x,this.location.y);
          rotate(counter*TWO_PI/360);
          translate(this.location.x * (-1),this.location.y * (-1));
          highlight();
          triangle(this.a.x,this.a.y,this.b.x,this.b.y,this.C.x,this.C.y);
        popMatrix();
        counter++;
      }
      else{
        highlight();
        //println(this.C.y);
        triangle(this.a.x,this.a.y,this.b.x,this.b.y,this.C.x,this.C.y);
      }
    }   
  }
} 

class Linea extends Figura
{
  Linea(int id_temp, int tam, float[] config)
  {
    super(id_temp, tam, config);
  }
  void update(Figura[] Figuras)
  {
    super.update(Figuras);
  }
  
  void display(Figura[] Figuras) //metodo que dibuja las figuras
  {
    PVector nl = new PVector(0,0);
    PVector n2 = new PVector(0,0);
    if((configuration[12] == 1.0) && (configuration[13] == 0.0)){
      nl.add(this.location);
      highlight();
      ellipseMode(CENTER);
      for(int ii = 0; ii < 60 ;ii++){
        nl.sub(this.velocity);
      }
      if(configuration[9] == 1.0){
        translate(this.velocity.x, this.velocity.y);
        rotate2D(this.velocity, 10);
        //this.velocity.rotate(counter*TWO_PI/360);
      }
      line(this.location.x,this.location.y,nl.x,nl.y);
      counter=1; 
    }
    
    else if((configuration[12] == 1.0) && (configuration[13] == 1.0)){
      nl.add(this.location);
      n2.add(this.location);
      highlight();
      ellipseMode(CENTER);
      float a = velocity.heading2D();
      //println(a);
      for(int ii = 0; ii < 30 ;ii++){
        nl.sub(this.velocity);
        n2.add(this.velocity);
      }
      translate(this.velocity.x, this.velocity.y);
      rotate2D(this.velocity, 10);
      //this.velocity.rotate(counter*TWO_PI/360);
      line(n2.x,n2.y,nl.x,nl.y);
      if (bandera == true){ 
        counter++;
        if(counter == 4){
          bandera = false;
        }
      }
      else if(bandera == false) {
        counter--;
        if(counter == -4){
          bandera = true;
        }
      }
    } 
    else if((configuration[12] == 1.0) && (configuration[13] == 2.0)){
       for(int i = 0 ;i < Figuras.length; i++){  //ciclo para comparar la figura actual con todas las demas
          if (this.id != i){  //condicion para no tomar encuenta la comparacion con la misma figura
            if(this.intersect(Figuras[i])){  //metodo para comparar si hay interseccion de la figura actual con alunas otras del arreglo
              ellipseMode(CENTER);
              nl.add(Figuras[i].location);
              nl.add(this.location);
              nl.div(2);
              float distance = this.location.dist(nl); 
              if(distance >= 10){
                highlight();
                line(this.location.x,this.location.y,nl.x,nl.y);
              }
              nl.x = 0;
              nl.y = 0;
            }
          }
       } 
    }
  }
}














Figura[] Figuras;
/*
int total_figuras = 20;      //0
float tamano = 80;//random(10,30); //1   Elige el tamaño de las figuras
int triangulo =  0;           //2        0-No dibuja triangulo, 1-si lo dibuja
int cuadro =     0;           //3        0-No dibuja cuadro, 1-si lo dibuja
int circulo =    0;           //4        0-No dibuja circulo, 1-si lo dibuja
int traslape =   1;           //5        0-No toma en cuenta el traslape, 1-si lo toma en cuenta
int c_color =    4;           //6        0-un solo color,1-de una paleta de colores,2-amarillo blanco,3-colores,4-escala de grices
int segir_otro = 0;           //7        0-no toma en cuenta, 1-seguir 
int Const_surface = 0;        //8        0-restringido , 1-no restringido  
int rotate_ =    1;           //9        0-No toma en cuenta, 1-Rotacion
int moveini =    3;           //10       0-inicia del centro,1-el eje x inicia del centro,2-el eje y inicia del centro,3-aleatorio x y
int criterio_color = 0;       //11       0-solo contorno, 1-relleno
int linea =      1;           //12       0-No dibuja linea, 1-si lo dibuja
int tipo  =      2;           //13       controla el tipo de la linea 0-2
int fondo =      3;           //14       Controla el color del fondo de 0-3
*/
//float[] config = {total_figuras, tamano, triangulo, cuadro, circulo, traslape, c_color, segir_otro, Const_surface, rotate_, moveini, criterio_color,linea,tipo,fondo};
//float[] chromosome = {31, 57, 1, 1, 1, 0, 4, 0, 1, 1, 0, 0, 0, 1, 3};

float[] chromosome = {34, 59, 0, 1, 0, 0, 3, 0, 0, 1, 1, 0, 0, 2, 3};
float[] getChromosome() { return chromosome; }

// Cambiar el tamaño de la pantalla del individuo
float[] screenSize = {300,450};
float[] getSize() { return screenSize; }


void Fondo(){//---------------------------funcion para elegir el color de fondo--------------------------
  
  int y = 0, col=0;//int(random(0,256));
 
  
  if(chromosome[14] == 0){
    background(0);
  }
  else if(chromosome[14] == 1){
    background(255,255,255);
  }
  
  
  else if(chromosome[14] == 2){
  
  
  /*  for(int i = 0;i < height;i++){
      noStroke();
      fill(col,255,255,100);
      rect(0,i,width,(height/5.0));
      if((y % 9) == 0){
        col++; 
      }
      y++;
    }
   */
  color   c1 = color(255,255,100);
  color c2 = color(0, 102, 153);
  setGradient(0, 0, width, height, c1, c2, Y_AXIS);
 // setGradient(50, 190, 540, 80, c2, c1, X_AXIS);
  
  }
  else if(chromosome[14] == 3){
    
    color   c1 = color(255,255,100);
  color c2 = color(0, 102, 153);
  setGradient(0, 0, width, height, c1, c2, X_AXIS);
 // setGradient(50, 190, 540, 80, c2, c1, X_AXIS);
    
 /*   
    col = int(random(0,256));
    for(int i = 0;i < height;i++){
      noStroke();
      fill(col,255,255,100);
      rect(0,i,width,(height/5.0));
      if((y % 9) == 0){
        col++; 
      }
      y++;
    }
  */
 }
}




void setup() 
{
  Figuras = new Figura[0];
  colorMode(HSB);
  int tot_fig = (int)chromosome[0];
  int tam = (int)chromosome[1];
  Figuras = new Figura[tot_fig];

  // Cambio de tamaño de shapes
  int reSize = getSize();
  int w = reSize[0];
  int h = reSize[1];
  
  size(w,h);

  background(0);
  Fondo();
  frameCount=0;
  loop();
  for (int i = 0; i < Figuras.length; i++)
  {
    float r = random(0,7);
    if ((chromosome[2] == 0.0) && (chromosome[3] == 0.0) && (chromosome[4] == 0.0) && (chromosome[12] == 1.0)){
      Figuras[i] = new Linea(i,tam,chromosome);
    }
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 0.0) && (chromosome[4] == 1.0) && (chromosome[12] == 0.0)){
       Figuras[i] = new Circulo(i,tam,chromosome);
    }  
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 0.0) && (chromosome[4] == 1.0) && (chromosome[12] == 1.0)){
      if (r < 3.5){
         Figuras[i] = new Linea(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Circulo(i,tam,chromosome);                                                                  //TRI   CUA    CIR    LIN
       }
    }  
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 1.0) && (chromosome[4] == 0.0) && (chromosome[12] == 0.0)){
       Figuras[i] = new Cuadro(i,tam,chromosome);
    }  
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 1.0) && (chromosome[4] == 0.0) && (chromosome[12] == 1.0)){
       if (r < 3.5){
         Figuras[i] = new Linea(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Cuadro(i,tam,chromosome);                                                                  //TRI   CUA    CIR    LIN
       }
    }  
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 1.0) && (chromosome[4] == 1.0) && (chromosome[12] == 0.0)){
      if (r < 3.5){
         Figuras[i] = new Cuadro(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Circulo(i,tam,chromosome);
       }
    }  
    else if ((chromosome[2] == 0.0) && (chromosome[3] == 1.0) && (chromosome[4] == 1.0) && (chromosome[12] == 1.0)){
      if (r < 2.33){
        Figuras[i] = new Circulo(i,tam,chromosome);
      }
      else if((r > 2.33) && (r < 4.66) ){
        Figuras[i] = new Cuadro(i,tam,chromosome);
      }   
      else{
        Figuras[i] = new Linea(i,tam,chromosome);
      }
    }
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 0.0) && (chromosome[4] == 0.0) && (chromosome[12] == 0.0)){           //TRI   CUA    CIR    LIN
       Figuras[i] = new Triangule(i,tam,chromosome);
    }
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 0.0) && (chromosome[4] == 0.0) && (chromosome[12] == 1.0)){
      if (r < 3.5){
         Figuras[i] = new Triangule(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Linea(i,tam,chromosome);
       }
    }   
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 0.0) && (chromosome[4] == 1.0) && (chromosome[12] == 0.0)){
      if (r < 3.5){
         Figuras[i] = new Triangule(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Circulo(i,tam,chromosome);
       }
    }
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 0.0) && (chromosome[4] == 1.0) && (chromosome[12] == 1.0)){      //TRI   CUA    CIR    LIN
      if (r < 2.33){
        Figuras[i] = new Circulo(i,tam,chromosome);
      }
      else if((r > 2.33) && (r < 4.66) ){
        Figuras[i] = new Triangule(i,tam,chromosome);
      }   
      else{
        Figuras[i] = new Linea(i,tam,chromosome);
      }
    }  
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 1.0) && (chromosome[4] == 0.0) && (chromosome[12] == 0.0)){
      if (r < 3.5){
         Figuras[i] = new Triangule(i,tam,chromosome);
       }
       else{
         Figuras[i] = new Cuadro(i,tam,chromosome);
       }
    }
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 1.0) && (chromosome[4] == 0.0) && (chromosome[12] == 1.0)){          //TRI   CUA    CIR    LIN
      if (r < 2.33){
        Figuras[i] = new Linea(i,tam,chromosome);
      }
      else if((r > 2.33) && (r < 4.66) ){
        Figuras[i] = new Triangule(i,tam,chromosome);
      }   
      else{
        Figuras[i] = new Cuadro(i,tam,chromosome);
      }
    }   
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 1.0) && (chromosome[4] == 1.0) && (chromosome[12] == 0.0)){
      if (r < 2.33){
        Figuras[i] = new Circulo(i,tam,chromosome);
      }
      else if((r > 2.33) && (r < 4.66) ){
        Figuras[i] = new Triangule(i,tam,chromosome);
      }   
      else{
        Figuras[i] = new Cuadro(i,tam,chromosome);
      }
    }
    else if ((chromosome[2] == 1.0) && (chromosome[3] == 1.0) && (chromosome[4] == 1.0) && (chromosome[12] == 1.0)){                 //TRI   CUA    CIR    LIN
      if (r < 1.75){
        Figuras[i] = new Circulo(i,tam,chromosome);
      }
      else if((r > 1.75) && (r < 3.5) ){
        Figuras[i] = new Triangule(i,tam,chromosome);
      }   
      else if((r > 3.5) && (r < 5.25) ){
        Figuras[i] = new Cuadro(i,tam,chromosome);
      }
      else{
        Figuras[i] = new Linea(i,tam,chromosome);
      }
    }  
    else{
      noLoop();
      //exit();
    }    
  }
  
 
 
}


void setGradient(int x, int y, float w, float h, color c1, color c2, int axis ) {

  noFill();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (int i = y; i <= y+h; i++) {
      float inter = map(i, y, y+h, 0, 1);
      color c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (int i = x; i <= x+w; i++) {
      float inter = map(i, x, x+w, 0, 1);
      color c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
 }
void draw() 
{
  
  //background(127,0,0);
  smooth();
  noFill();
  
  for(int i = 0;i < Figuras.length;i++)
    {
      Figuras[i].update(Figuras);     
    } 
  for(int i = 0;i < Figuras.length;i++)
    {
      Figuras[i].display(Figuras);
    }
  
 
  if(frameCount == 100){
//if(frameCount % 100 == 0){
   //setup(); 
    noLoop();

  }
  
}