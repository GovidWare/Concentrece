var ParejasNoEncontradas;
var MostrarCronometro;
var ParejasJugadas;
var ErroresActual;
var PrimerClick;

const MostrarPuntajes = (Puesto = null) => {

  const TableroPuntajes = document.querySelector('#MejoresPuntajes tbody');

  TableroPuntajes.innerHTML = '';
  for (let I = 0; I < 10; I++) {
    let NickName = ObtenerCookie(`NickName_${I}`);
    let Tiempo = ObtenerCookie(`Tiempo_${I}`);
    let Parejas = ObtenerCookie(`Parejas_${I}`);
    let Errores = ObtenerCookie(`Errores_${I}`);

    if(Tiempo!= null){

      Errores = (Errores == '')? 0 : Errores; 
      
      if(Puesto != null && I == Puesto){
        TableroPuntajes.innerHTML +=`
        <tr class='nuevo-puntaje'>
          <td><div>${I+1}<div></td>
          <td>${NickName}</td>
          <td>${Tiempo}</td>
          <td>${Parejas}</td>
          <td>${Errores}</td>
        </tr>`;
      }else{
        TableroPuntajes.innerHTML +=`
        <tr class='alternar'>
          <td><div>${I+1}<div></td>
          <td>${NickName}</td>
          <td>${Tiempo}</td>
          <td>${Parejas}</td>
          <td>${Errores}</td>
        </tr>`;
      }
    }
  }
  if(TableroPuntajes.innerHTML == ''){
    TableroPuntajes.innerHTML +=`
      <tr class='sin-puntajes'>
        <td><div>0<div></td>
        <td colspan='4'>No hay puntajes registrados</td>
      </tr>`;
  }
  
}

const IniciarJuego = () => {

  window.onbeforeunload = ()=> { return '' } ; // Preguntar si desea salir de la aplicación

  MostrarPuntajes();

  document.getElementById('BotonAceptar').addEventListener('click', PintarTablero);
  document.getElementById('InputParejas').addEventListener('keypress', (e) => {
    if (e.keyCode === 13 || e.key === 'Enter') {
      PintarTablero();
    }
  });

  const BotonPuntajes = document.getElementById('BotonPuntajes');
  const MejoresPuntajes = document.getElementById('MejoresPuntajes');

  BotonPuntajes.addEventListener('click',()=>{
    ClickBotonPuntajes(BotonPuntajes, MejoresPuntajes);
  });
}

const ClickBotonPuntajes = (BotonPuntajes, MejoresPuntajes)=>{

  if(BotonPuntajes.textContent === '⯈'){
    BotonPuntajes.textContent = '⯇';
    BotonPuntajes.style.right = '0px';
    MejoresPuntajes.style.width = '0px';
    MejoresPuntajes.style.right = '0px';

  }else{
    BotonPuntajes.textContent = '⯈';
    BotonPuntajes.style.right = '408px';
    MejoresPuntajes.style.width = '400px';
    MejoresPuntajes.style.right = '8px';
  } 
}

const PintarTablero = () => {

  const ValorIngresado = document.getElementById('InputParejas');

  if (ValorIngresado.value < 8 || ValorIngresado.value > 150) {
    alert('El número de parejas ingresadas no es valido');
    ValorIngresado.value = '';
    ValorIngresado.focus();
    return;
  }
  PrimerClick = true;
  document.querySelector('#Cronometro span').innerHTML='00 : 00 : 00 : 00';

  const BotonPuntajes = document.getElementById('BotonPuntajes');
  
  if(BotonPuntajes.textContent === '⯈'){
    const MejoresPuntajes = document.getElementById('MejoresPuntajes');
    ClickBotonPuntajes(BotonPuntajes, MejoresPuntajes);
  }

  document.getElementById('Tablero').style.display = 'flex';
  clearInterval(MostrarCronometro);

  const CantidadTarjetas = ValorIngresado.value * 2;
  ParejasNoEncontradas = CantidadTarjetas / 2;
  ParejasJugadas = ParejasNoEncontradas;
  ErroresActual = 0;

  const Tablero = document.getElementById('Tablero');
  Tablero.innerHTML = '';
  const Parejas = CrearParejas(CantidadTarjetas);
  const Fragmento = document.createDocumentFragment();

  for (let I = 0; I < CantidadTarjetas; I++) {

    let Tarjeta = document.createElement('div');
    Tarjeta.classList.add('tarjeta', 'cubierta');

    let Atras = document.createElement('img');
    Atras.className = 'atras';

    let Imagen = Parejas[I];

    Imagen = (Imagen < 10) ? '00' + Imagen : (Imagen < 100) ? '0' + Imagen : Imagen;

    Atras.setAttribute('src', `Pokemons/${Imagen}.png`);

    let Adelante = document.createElement('img');
    Adelante.className = 'adelante';
    Adelante.setAttribute('src', `Pokemons/000.png`);

    Tarjeta.appendChild(Atras);
    Tarjeta.appendChild(Adelante);

    Tarjeta.addEventListener('click', ClickTarjeta);

    Fragmento.appendChild(Tarjeta);
  }
  Tablero.appendChild(Fragmento);
}

const CrearParejas = (CantidadTarjetas) => {

  let Min = 1;
  let Max = 150;
  const Length = CantidadTarjetas / 2;

  let num = Math.floor(Math.random() * ((Max + 1) - Min) + Min);
  let AleatoriosMitadUno = [];
  let AleatoriosMitadDos = [];

  for (let I = 1; I <= Length; I++) {
    while (AleatoriosMitadUno.includes(num)) {
      num = Math.floor(Math.random() * ((Max + 1) - Min) + Min);
    }
    AleatoriosMitadUno.push(num);
  }

  Min = 0;
  Max = Length - 1;

  num = Math.floor(Math.random() * ((Max + 1) - Min) + Min);

  for (let I = 1; I <= Length; I++) {
    while (AleatoriosMitadDos.includes(AleatoriosMitadUno[num])) {
      num = Math.floor(Math.random() * ((Max + 1) - Min) + Min);
    }
    AleatoriosMitadDos.push(AleatoriosMitadUno[num]);
  }

  return [...AleatoriosMitadUno, ...AleatoriosMitadDos];
}

const ClickTarjeta = (e) => {

  if(PrimerClick){
    IniciarCronometro();
    PrimerClick = false;
  }

  const Tarjeta = e.currentTarget;
  Tarjeta.removeEventListener('click', ClickTarjeta);

  Tarjeta.classList.add('duda');
  Tarjeta.classList.replace('cubierta', 'descubierta');

  const TarjetaDuda = document.getElementsByClassName('duda');
  const ImgTarjetaDuda = document.querySelectorAll('.duda .atras');

  if (TarjetaDuda.length == 2) {

    const TarjetaDudaUno = TarjetaDuda[0];
    const TarjetaDudaDos = TarjetaDuda[1];

    const ImgTarjetaDudaUno = ImgTarjetaDuda[0];
    const ImgTarjetaDudaDos = ImgTarjetaDuda[1];

    if (ImgTarjetaDudaUno.src == ImgTarjetaDudaDos.src) {
      TarjetasIguales(TarjetaDudaUno, TarjetaDudaDos);
      ParejasNoEncontradas--;
      if (ParejasNoEncontradas == 0) {
        clearInterval(MostrarCronometro);

        let Milisegundos = 500;
        setTimeout(() => {
          Termino();
        }, Milisegundos);
      }
    } else {
      TarjetasDistintas(TarjetaDudaUno, TarjetaDudaDos);
      ErroresActual++;
    }
  }
}

const TarjetasDistintas = (TarjetaDudaUno, TarjetaDudaDos) => {
  const Milisegundos = 150;

  setTimeout(() => {
    TarjetaDudaUno.classList.replace('duda', 'incorrecta');
    TarjetaDudaDos.classList.replace('duda', 'incorrecta');

    setTimeout(() => {
      TarjetaDudaUno.classList.remove('incorrecta');
      TarjetaDudaDos.classList.remove('incorrecta');

      setTimeout(() => {
        TarjetaDudaUno.classList.replace('descubierta', 'cubierta');
        TarjetaDudaDos.classList.replace('descubierta', 'cubierta');

        TarjetaDudaUno.addEventListener('click', ClickTarjeta);
        TarjetaDudaDos.addEventListener('click', ClickTarjeta);
      }, Milisegundos);

    }, Milisegundos);

  }, Milisegundos);
}

const TarjetasIguales = (TarjetaDudaUno, TarjetaDudaDos) => {
  const Milisegundos = 200;

  setTimeout(() => {
    TarjetaDudaUno.classList.replace('duda', 'correcta');
    TarjetaDudaDos.classList.replace('duda', 'correcta');

    setTimeout(() => {
      TarjetaDudaUno.classList.remove('correcta');
      TarjetaDudaDos.classList.remove('correcta');

    }, Milisegundos);

  }, Milisegundos);
}

const IniciarCronometro = () => {

  let Cronometro = document.querySelector('#Cronometro span');
  let TiempoInicial = new Date();

  MostrarCronometro = setInterval(() => {
    let TiempoActual = new Date();
    Cronometro.textContent = AumentarTiempo(TiempoInicial, TiempoActual);
  }, 10);

}

const AumentarTiempo = (TiempoInicial, TiempoActual) => {

  let TiempoAux = TiempoActual - TiempoInicial;
  let Tiempo = new Date();
  Tiempo.setTime(TiempoAux);

  let Horas = DosDigitos(Tiempo.getHours() - 19);
  let Minutos = DosDigitos(Tiempo.getMinutes());
  let Segundos = DosDigitos(Tiempo.getSeconds());
  let Milisegundos = Tiempo.getMilliseconds();
  Milisegundos = DosDigitos(Math.round(Milisegundos / 10));

  return `${Horas} : ${Minutos} : ${Segundos} : ${Milisegundos}`;

}

const DosDigitos = (Numero) => {
  return (Numero < 10) ? '0' + Numero : Numero;
}

const Termino = () => {

  const Puesto = ConsultarPuntajes();
  let Tiempo = document.querySelector('#Cronometro span');

  if (Puesto != -1) {
    
    let NickName = prompt('¡Felicidades Terminaste! \nIngresa tu nombre :');

    NickName = (NickName == undefined || NickName.trim() == '' )? 'Usuario' : NickName;
    
    while (NickName.length > 10) {
      NickName = prompt('El nombre ingresado puede tener máximo 10 caracteres, intenta de nuevo.\nIngresa tu nombre :');
    }

    NickName = (NickName == undefined || NickName.trim() == '' )? 'Usuario' : NickName;
    
    ConfigurarCookie(`NickName_${Puesto}`, NickName, 100);
    ConfigurarCookie(`Tiempo_${Puesto}`, Tiempo.innerText, 100);
    ConfigurarCookie(`Parejas_${Puesto}`, ParejasJugadas, 100);
    ConfigurarCookie(`Errores_${Puesto}`, ErroresActual, 100);
    
    MostrarPuntajes(Puesto);

    const BotonPuntajes = document.getElementById('BotonPuntajes');
    if(BotonPuntajes.textContent === '⯇'){
      const MejoresPuntajes = document.getElementById('MejoresPuntajes');
      ClickBotonPuntajes(BotonPuntajes, MejoresPuntajes);
    }

  }else{
    alert('¡Felicidades Terminaste! \n\nPuedes seguir jugando para quedar entre los 10 mejores.');
  }
  Tiempo.innerText = '00 : 00 : 00 : 00';
  document.getElementById('InputParejas').focus();
}

const ConfigurarCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const ObtenerCookie = (name) => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,
      c.length);
  }
  return null;
};

const ConsultarPuntajes = ()=>{

  let TiempoActual = document.querySelector('#Cronometro span').innerHTML;
  TiempoActual = ConvertirTiempoMilisegundos(TiempoActual);

  if (TiempoActual == 0) {
    return -1
  }
  
  for (let I = 0; I < 10; I++) {
    let TiempoAlmacedado = ObtenerCookie(`Tiempo_${I}`);

    if(TiempoAlmacedado != null){
      let TiempoAlmacedadoDecimal = ConvertirTiempoMilisegundos(TiempoAlmacedado);
      let ParejasAlmacenadas = ObtenerCookie(`Parejas_${I}`);
      let ErroresAlmacenados = ObtenerCookie(`Errores${I}`);

      let MejorPuntaje = ComprobarMejorPuntaje(TiempoActual, ParejasJugadas, ErroresActual, TiempoAlmacedadoDecimal, ParejasAlmacenadas, ErroresAlmacenados);

      if(MejorPuntaje){
        MoverPuntajes(I);
        return I;
      }

    }else{
      return I;
    }
  }
  return -1;
}

const ComprobarMejorPuntaje = (Ti_Act, Pj_Act, Err_Act, Ti_Alm, Pj_Alm, Err_Alm)=>{

  /**
   Suponiendo un juego de 8 parejas donde el usuario se demoro 10 segundos en terminar
   según la fórmula propuesta esto daría 126,9144

   Ahora supongamos un juego de 9 parejas donde el usuario se demora 12 segundos con 800 milesimas
   según la fórmula propuesta esto daría 126,8530

   La fórmula dejaria al segundo caso en una mejor clasificación dadole 2 segundos con 800 milesimas
   de ventaja a cambio de jugar una pareja más
   
   */
  
  const ProporcionActual     = (parseInt(Ti_Act) * Math.pow((1 / parseFloat(Pj_Act)), 1.1) ) / parseFloat(Pj_Act);
  const ProporcionAlmacenada = (parseInt(Ti_Alm) * Math.pow((1 / parseFloat(Pj_Alm)), 1.1) ) / parseFloat(Pj_Alm);
  const ErrorActual = parseInt(Err_Act);
  const ErrorAlmacenado = parseInt(Err_Alm);

  console.log('ProporcionActual= '+ProporcionActual +', ProporcionAlmacenada= '+ProporcionAlmacenada);

  if (ProporcionActual < ProporcionAlmacenada) {
    return true;
  }else if (ProporcionActual == ProporcionAlmacenada){
    return (ErrorActual < ErrorAlmacenado);
  }else{
    return false;
  }
}

const MoverPuntajes = (J)=>{

  let Ultimo = 0;
  let TiempoAlmacedado;

  for (let I = 0; I < 10; I++) {
    TiempoAlmacedado = ObtenerCookie(`Tiempo_${I}`);
    if(TiempoAlmacedado != null){
      Ultimo = I;
    }else{
      break;
    }
  }

  Ultimo = (Ultimo < 9)? Ultimo + 1 : Ultimo;
  
  for (let I = Ultimo; I >= J + 1; I--) {

    ConfigurarCookie(`NickName_${I}`, ObtenerCookie(`NickName_${I-1}`), 100);
    ConfigurarCookie(`Tiempo_${I}`, ObtenerCookie(`Tiempo_${I-1}`), 100);
    ConfigurarCookie(`Parejas_${I}`, ObtenerCookie(`Parejas_${I-1}`), 100);
    ConfigurarCookie(`Errores_${I}`, ObtenerCookie(`Errores_${I-1}`), 100);
  }

}

const ConvertirTiempoMilisegundos = (Tiempo)=>{
  Tiempo = Tiempo.split(':');
  let TiempoMilisegundos = 0;

  TiempoMilisegundos += parseInt(Tiempo[0])*60*60*1000;
  TiempoMilisegundos += parseInt(Tiempo[1])*60*1000;
  TiempoMilisegundos += parseInt(Tiempo[2])*1000;
  TiempoMilisegundos += parseInt(Tiempo[3]);

  return TiempoMilisegundos;
}

IniciarJuego();