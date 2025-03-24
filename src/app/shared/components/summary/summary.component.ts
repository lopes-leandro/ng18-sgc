import { Component, Input } from '@angular/core';
import { CardComponent } from '../ui/card/card.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  @Input() data: Record<string, any> = {};
  @Input() onComplete: any;
  @Input() onBack: any;

  // Processo de entrada de dados dentro das sessões de visialização

  get sections() {

    // Isso é simplificado - em um aplicativo real, você transformaria o modelo de dados
    // no formato de exibição apropriado com base no tipo de workflow
    const sections = [];

    if (this.data['clientName']) {

      // Para o workflow Novo Contrato
      sections.push({
        title: 'Informações do Contrato',
        items: [
          { label: 'Cliente', value: this.data['clientName'] },
          { label: 'Tipo de Contrato', value: this.getContractTypeLabel(this.data['contractType']) },
          { label: 'Data de Início', value: new Date(this.data['startDate']).toLocaleDateString() }
        ]
      });
    }

    if (this.data['duration']) {
      sections.push({
        title: 'Condições Contratuais',
        items: [
          { label: 'Prazo do Contrato', value: `${this.data['duration']} meses` },
          { label: 'Valor Total', value: this.formatCurrency(this.data['totalValue']) },
          { label: 'Forma de Pagamento', value: this.getPaymentMethodLabel(this.data['paymentMethod']) }
        ]
      });
    }

    if (this.data['documents']) {
      const documentItems = this.data['documents']
        .filter((doc: any) => doc.selected)
        .map((doc: any) => ({ label: doc.name, value: 'Incluído' }));

      if (documentItems.length > 0) {
        sections.push({
          title: 'Documentação',
          items: documentItems
        });
      }
    }

    if (this.data['contractId']) {
      // For add items workflow
      sections.push({
        title: 'Informações do Contrato',
        items: [
          { label: 'ID do Contrato', value: this.data['contractId'] },
          { label: 'Cliente', value: this.data['contractName'] || 'N/A' }
        ]
      });
    }

    if (this.data['items']?.length) {
      sections.push({
        title: 'Items do Contrato',
        items: this.data['items'].map((item: any) => ({
          label: item.name || item.description,
          value: `${item.quantity} x ${this.formatCurrency(item.unitPrice)} = ${this.formatCurrency(item.totalPrice)}`
        }))
      });

      if (this.data['orderSummary']) {
        sections.push({
          title: 'Resumo do Pedido',
          items: [
            { label: 'Subtotal', value: this.formatCurrency(this.data['orderSummary'].subtotal) },
            { label: 'Imposto (10%)', value: this.formatCurrency(this.data['orderSummary'].tax) },
            { label: 'Total', value: this.formatCurrency(this.data['orderSummary'].total) }
          ]
        });
      }
    }

    if (this.data['delivery']) {
      const deliveryItems = [
        { label: 'Método de Entrega', value: this.getDeliveryMethodLabel(this.data['delivery'].deliveryMethod) }
      ];

      if (this.data['delivery'].deliveryDate) {
        deliveryItems.push({
          label: 'Data de Entrega',
          value: new Date(this.data['delivery'].deliveryDate).toLocaleDateString()
        });
      }

      if (this.data['delivery'].deliveryMethod === 'shipping' && this.data['delivery'].address) {
        const address = this.data['delivery'].address;
        deliveryItems.push({
          label: 'Endereço de Entrega',
          value: `${address.street}, ${address.number} - ${address.city}, ${address.state}`
        });
      }

      sections.push({
        title: 'Condições de Entrega',
        items: deliveryItems
      });
    }

    return sections;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private getContractTypeLabel(type: string): string {
    const types: Record<string, string> = {
      'service': 'Serviço',
      'product': 'Produto',
      'mixed': 'Misto'
    };
    return types[type] || type;
  }

  private getPaymentMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      'monthly': 'Mensal',
      'quarterly': 'Trimestral',
      'semiannual': 'Semestral',
      'annual': 'Anual',
      'upfront': 'À Vista'
    };
    return methods[method] || method;
  }

  private getDeliveryMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      'download': 'Download Digital',
      'email': 'Envio por Email',
      'onsite': 'Entrega no Local',
      'shipping': 'Envio por Transportadora'
    };
    return methods[method] || method;
  }
}
