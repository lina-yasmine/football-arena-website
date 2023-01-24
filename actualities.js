// fonction qui affiche les données récupérées du ficher XML par la requete  
  function afficher(xhttp) {
    var i;
    var racineXML = xhttp.responseXML;
    //var table="";
    var matchs = racineXML.getElementsByTagName("match");

    //creation d'un element <table> pour afficher les scores
    
    let container = document.createElement('div'); 
    container.setAttribute('class', 'removed');

    for (i = 0; i <matchs.length; i++){

      //créer une section pour chaque match
      let section = document.createElement('section');
      section.setAttribute('class', 'match');

      //le header de chaque section contient l'importance du match (final, demi final, ...)
      let header = document.createElement('header');
      header.setAttribute('class', 'importance');
      let importance = matchs[i].getElementsByTagName("importance")[0].childNodes[0].nodeValue;
      header.innerText = importance;
      section.appendChild(header);

      let table = document.createElement('table');  //une table pour organiser l'affichage

      //la ligne 1 contient le score du match
      let tr1 = document.createElement('tr');
      tr1.setAttribute('class', 'ligne principale');

      // nom de l'équipe 1
      tdeq1 = document.createElement('td');
      tdeq1.setAttribute('class', 'noms_equipes');
      eq1 = document.createTextNode(matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("nom")[0].childNodes[0].nodeValue);
      tdeq1.appendChild(eq1);
      tr1.appendChild(tdeq1);

      // drapeau de l'équipe 1
      tddrap1 = document.createElement('td');
      tddrap1.setAttribute("class", "flags");
      img1 = document.createElement('img');
      img1.setAttribute("src", matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("drapeau")[0].childNodes[0].nodeValue);
      tddrap1.appendChild(img1);
      tr1.appendChild(tddrap1);

      // resultat du match
      resultat = document.createElement('td');
      resultat.setAttribute('class', 'resultats');

      //pour gérer le cas ou le match se termine avec des pinalties suite à un résultat null
      divResFinal = document.createElement('div');  //resultat final
      divResFinal.setAttribute('class', 'res-final');
      resFinal1 = matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("score")[0].getElementsByTagName("final")[0].childNodes[0].nodeValue;
      resFinal2 = matchs[i].getElementsByTagName("equipe")[1].getElementsByTagName("score")[0].getElementsByTagName("final")[0].childNodes[0].nodeValue;
      divResFinal.innerText = resFinal1+' - '+resFinal2;
      resultat.appendChild(divResFinal);

      if (matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("score")[0].getElementsByTagName("null")[0]!=undefined){ //si le match est terminé avec un résultat null
        //afficher que le resultat  final conserne les tirs aux buts
        divTirs = document.createElement('div');
        divTirs.setAttribute('class', 'divTirs');
        divTirs.appendChild(document.createTextNode('Tirs aux buts'));
        resultat.appendChild(divTirs);

        //afficher le ressultat null s'il existe
        divResNull = document.createElement('div');   
        divResNull.setAttribute('class', 'res-null');
        resNull1 = matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("score")[0].getElementsByTagName("null")[0].childNodes[0].nodeValue;
        resNull2 = matchs[i].getElementsByTagName("equipe")[1].getElementsByTagName("score")[0].getElementsByTagName("null")[0].childNodes[0].nodeValue;
        divResNull.innerText = resNull1+' - '+resNull2;
        resultat.appendChild(divResNull);
      }
      tr1.appendChild(resultat);

      // drapeau de l'équipe 2
      tddrap2 = document.createElement('td');
      tddrap2.setAttribute("class", "flags");
      img2 = document.createElement('img');
      img2.setAttribute("src", matchs[i].getElementsByTagName("equipe")[1].getElementsByTagName("drapeau")[0].childNodes[0].nodeValue);
      tddrap2.appendChild(img2);
      tr1.appendChild(tddrap2);

      // nom de l'équipe 2
      tdeq2 = document.createElement('td');
      tdeq2.setAttribute('class', 'noms_equipes');
      eq2 = document.createTextNode(matchs[i].getElementsByTagName("equipe")[1].getElementsByTagName("nom")[0].childNodes[0].nodeValue);
      tdeq2.appendChild(eq2);
      tr1.appendChild(tdeq2);

      //insérer un button pour afficher les détails
      voirplus = document.createElement('td');
      voirplus.setAttribute('class', 'voir_plus_td');
      button = document.createElement('button');
      button.setAttribute('class', 'voir_plus'); 
      button.setAttribute('onclick', 'voirPlus('+i+')');
      iconvoirplus = document.createElement('img');
      iconvoirplus.setAttribute('src', 'icons/arrow-button.png');
      button.appendChild(iconvoirplus);
      voirplus.appendChild(button);
      tr1.appendChild(voirplus);

      table.appendChild(tr1);
      section.appendChild(table); 

      // la ligne 2 contient les buteurs du match et les minutes des buts
      table2 = document.createElement('table');

      let tr2 = document.createElement('tr');
      tr2.setAttribute('class', 'ligne2');
      // les buts
      for (let equipe_item=0; equipe_item<2; equipe_item++){  // pour les 2 equipes
        let buts = matchs[i].getElementsByTagName('equipe')[equipe_item].getElementsByTagName('but'); //recuperer les buts de l'equipe a partir du fichier
        var buteurstd = document.createElement('td'); // contient tous les buteurs de l'équipe et les minutes des buts
        
        if (equipe_item==0)
          buteurstd.setAttribute("class", "buteurs left");
        else
          buteurstd.setAttribute("class", "buteurs right");

        for (let j=0; j<buts.length; j++){
          let butInfos = document.createElement('div');  //contient 2 <span> (pour buteur & minute du but)
          //butInfos.setAttribute("class", "buteurs");
          //buteur
          let joueurspan = document.createElement('span');
          joueur = document.createTextNode(buts[j].getElementsByTagName('joueur')[0].childNodes[0].nodeValue);
          joueurspan.appendChild(joueur);
      
          butInfos.appendChild(joueurspan);

          //minute du but
          let minute = document.createElement('span');
          minute.innerText = "   " + buts[j].getElementsByTagName('minute')[0].childNodes[0].nodeValue + "'";
          butInfos.appendChild(minute);

          buteurstd.appendChild(butInfos);
          tr2.appendChild(buteurstd);
          table2.appendChild(tr2);
        }
      }

      
      tr3 = document.createElement('tr');
      tr3.setAttribute('class', 'tr_tirs');
      tr3.innerText = 'Tirs aux buts';
      table2.appendChild(tr3);

      // la ligne 4 contient les tirs aux buts s'ils existent 

      if (matchs[i].getElementsByTagName("equipe")[0].getElementsByTagName("score")[0].getElementsByTagName("null")[0]!=undefined){  //si le match est terminé avec un résultat null
        let tr4 = document.createElement('tr');
        tr4.setAttribute('class', 'ligne ligne3');
        
        for (let equipe_item=0; equipe_item<2; equipe_item++){
          let pinalties = matchs[i].getElementsByTagName('equipe')[equipe_item].getElementsByTagName('pinalty'); //recuperer les tirs aux buts de l'equipe a partir du fichier
          pinaltiestd = document.createElement('td'); // contient tous les pinalties de l'équipe
          if (equipe_item==0)
            pinaltiestd.setAttribute("class", "pinalties left");
          else
            pinaltiestd.setAttribute("class", "pinalties right");

          for(let j=0; j<pinalties.length; j++){
            let pinaltyInfos = document.createElement('div');
            let joueurspan = document.createElement('span');
            joueur = document.createTextNode(pinalties[j].getElementsByTagName('joueur')[0].childNodes[0].nodeValue);
            joueurspan.appendChild(joueur);
        
            pinaltyInfos.appendChild(joueurspan);

            //pinalty raté ou marqué
            let etatspan = document.createElement('span');
            etatspan.innerText = "   " + pinalties[j].getElementsByTagName('etat')[0].childNodes[0].nodeValue;
            if(pinalties[j].getElementsByTagName('etat')[0].childNodes[0].nodeValue == 'marqué')
              etatspan.setAttribute('style', 'color: rgb(96,215,166)');
            else
              etatspan.setAttribute('style', 'color: red');
            pinaltyInfos.appendChild(etatspan);

            pinaltiestd.appendChild(pinaltyInfos);
            tr4.appendChild(pinaltiestd);
            table2.appendChild(tr4);
          }
        }
      }
      section.appendChild(table2); 
      container.appendChild(section);
    }
    document.getElementById('scores-container').appendChild(container);
  }


  // fonction qui réduit l'affichage des détails d'un match à l'evenement onclick 
  function reduire(i) {
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne2')[0].style.display = 'none';
    if (document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne3')[0]!=undefined){
      document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne3')[0].style.display = 'none';
      document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('tr_tirs')[0].style.display = 'none';
    }
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName("voir_plus")[0].getElementsByTagName('img')[0].setAttribute("src", "icons/arrow-button.png");
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName("voir_plus")[0].setAttribute('onclick', 'voirPlus('+i+')');
    document.getElementById('scores-container').getElementsByTagName('section')[i].querySelector('.principale').setAttribute('style', 'background-color: rgb(5,33,56); color: white; font-weight: normal;');
    document.getElementById('scores-container').getElementsByTagName('section')[i].setAttribute('style', 'border-radius: 0');
  }
  
  // fonction qui affiche les détails d'un match à l'evenement onclick 
  function voirPlus(i) {
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne2')[0].style.display = 'flex';
    if (document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne3')[0]!=undefined){
      document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('ligne3')[0].style.display = 'flex';
      document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName('tr_tirs')[0].style.display = 'block';
    }
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName("voir_plus")[0].getElementsByTagName('img')[0].setAttribute("src", "icons/arrow-button - top.png");
    document.getElementById('scores-container').getElementsByTagName('section')[i].getElementsByClassName("voir_plus")[0].setAttribute('onclick', 'reduire('+i+')');
    document.getElementById('scores-container').getElementsByTagName('section')[i].querySelector('.principale').setAttribute('style', 'background-color: #0b3663; color: white; font-weight: bold;');
    document.getElementById('scores-container').getElementsByTagName('section')[i].setAttribute('style', 'border-radius: 0 0 10px 10px');
  }
  
  var req = new XMLHttpRequest();
  
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      afficher(req);
    }
  };
  
  req.open("GET","matchs.xml",true);
  req.send();

