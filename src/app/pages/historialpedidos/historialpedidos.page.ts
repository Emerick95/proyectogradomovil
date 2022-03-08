import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { async } from 'rxjs';

@Component({
  selector: 'app-historialpedidos',
  templateUrl: './historialpedidos.page.html',
  styleUrls: ['./historialpedidos.page.scss'],
})
export class HistorialpedidosPage implements OnInit {

  @Input() id_pedido
  nombre_empresa
  pedidos = []
  vendedores = []
  productos = []
  vendedoreSelected = []
  subtotalArray = []

  subtotalfinal = null;

  direccion: string;
  telefono: string;
  email: string;
  precioUni: string;

  constructor(
    private modalCtrl: ModalController,
    private vendedorServ: VendedorService,
    private prodServ: ProductoService,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit() {
    console.log('id_pedido',this.id_pedido.id)
    //this.showEmpresa()
    this.subTotalFinal()
    this.showPedidoFinal()
    

  }

  subTotalFinal(){
    this.auth.onAuthStateChanged(user => {
      this.prodServ.getPedidoFinal(user.uid).subscribe(data => {
        data.map(item => {
          if(item.empresa_pedido === this.nombre_empresa){
            let subtotal = parseFloat(item.subtotal)
            this.subtotalArray.push(subtotal)
            this.subtotalfinal = this.subtotalArray.reduce((a,b) => a+b, 0)
            //console.log("subtotal final: "+this.subTotalFinal)
          }
        })
      })

     })
    
  }

  showEmpresa(){
    this.vendedorServ.getVendedor().subscribe(
      list => {
        this.vendedores = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          }
        })
        this.vendedores.map(item => {
          
          if(item.nombre_empresa === this.nombre_empresa){
            this.direccion = item.direccion_vendedor
            this.telefono = item.telefono_vendedor
            this.email = item.email_vendedor
            console.log("direccion: "+this.direccion)
            console.log("telefono: "+this.telefono)
            console.log("email: "+this.email)
          }
        })
        
      }
    )
  }
fecha
  async showPedidoFinal()
  {
    this.auth.onAuthStateChanged(user => {




      this.prodServ.getPedidoFinal(user.uid).subscribe(data => {
        data.map((item) => {
          if(item.id_pedido === this.id_pedido){
            this.prodServ.getProduct().subscribe(prod => {
                this.productos = prod.map(ite => {
                    if(ite.id_prod == item.id_prod){
                      this.precioUni=ite.precio_producto
                    }
                  })
             
            })

          this.vendedorServ.getVendedor().subscribe(
            list => {
            this.vendedores = list.map(item => {
                return {
                  $key: item.key,
                  ...item.payload.val()
                }
              })
               
            this.vendedores= this.vendedores.filter(value => value.nombre_empresa == item.empresa_pedido)
    
               this.vendedores.map(it=>{
                this.email=it.email_vendedor
                this.telefono=it.telefono_vendedor
                
    
              })

              console.log("valor de lso vendedrores: "+this.email,this.telefono)

              
            
                this.pedidos.push({
                  cantidad_pedido: item.cantidad_pedido,
                  categoria_pedido: item.categoria_pedido,
                  empresa_pedido: item.empresa_pedido,
                  id_pedido: item.id_pedido,
                  id_prod: item.id_prod,
                  imagen_pedido: item.imagen_pedido,
                  nombre_pedido: item.nombre_pedido,
                  precio_pedido: item.precio_pedido,
                  fecha:item.fecha_pedido,
                  email: this.email,
                  telefono: this.telefono,
                  precio_uni: this.precioUni
                })
                
                // this.fecha=item.fecha_pedido
                //console.log("length: "+this.fecha)
              
            })

          }
      
       
         
        })
        
      })

     })
    
    
  }

  close(){
    this.modalCtrl.dismiss()
  }

}
