type OrderItem = {
  productName: string
  quantity: number
  price: number
}

type OrderEmailParams = {
  orderId: string
  fullName: string
  phone: string
  wilaya: string
  commune: string
  address: string
  deliveryNote?: string | null
  items: OrderItem[]
  total: number
}

export function orderNotificationEmail(order: OrderEmailParams): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align:center;">×${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align:right; font-weight:bold;">${(item.price * item.quantity).toLocaleString()} DA</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin:0; padding:0; background:#f9f9f9; font-family: -apple-system, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background: #1c1917; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 22px; letter-spacing: 2px;">
            DZ BOUTIQUE
          </h1>
          <p style="margin: 8px 0 0; color: #a8a29e; font-size: 13px;">
            Nouvelle commande recue
          </p>
        </div>

        <!-- Alert banner -->
        <div style="background: #16a34a; padding: 12px 32px; text-align: center;">
          <p style="margin: 0; color: white; font-weight: bold; font-size: 15px;">
            🛍️ Nouvelle commande !
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">

          <!-- Customer info -->
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #1c1917; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">
            Informations client
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Nom</td>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${order.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Telephone</td>
              <td style="padding: 6px 0; font-size: 14px;">
                <a href="tel:${order.phone}" style="color: #1c1917; font-weight: bold;">${order.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Wilaya</td>
              <td style="padding: 6px 0; font-size: 14px;">${order.wilaya}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Commune</td>
              <td style="padding: 6px 0; font-size: 14px;">${order.commune}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Adresse</td>
              <td style="padding: 6px 0; font-size: 14px;">${order.address}</td>
            </tr>
            ${order.deliveryNote ? `
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Note</td>
              <td style="padding: 6px 0; font-size: 14px; color: #d97706;">${order.deliveryNote}</td>
            </tr>
            ` : ''}
          </table>

          <!-- Order items -->
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #1c1917; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px;">
            Articles commandes
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <thead>
              <tr style="background: #f9f9f9;">
                <th style="padding: 10px; text-align:left; font-size:13px; color:#78716c;">Produit</th>
                <th style="padding: 10px; text-align:center; font-size:13px; color:#78716c;">Qte</th>
                <th style="padding: 10px; text-align:right; font-size:13px; color:#78716c;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Total -->
          <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; text-align: right; margin-bottom: 24px;">
            <span style="font-size: 14px; color: #78716c;">Total a percevoir : </span>
            <span style="font-size: 22px; font-weight: bold; color: #1c1917;">${order.total.toLocaleString()} DA</span>
          </div>

          <!-- WhatsApp CTA -->
          <div style="text-align: center; margin-bottom: 16px;">
            <a href="https://wa.me/${order.phone.replace(/^0/, '213')}"
              style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
              📱 Contacter le client sur WhatsApp
            </a>
          </div>

          <!-- Admin link -->
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/admin/orders"
              style="display: inline-block; border: 1px solid #e7e5e4; color: #78716c; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px;">
              Voir dans l'admin →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9f9f9; padding: 16px 32px; text-align: center; border-top: 1px solid #f0f0f0;">
          <p style="margin: 0; color: #a8a29e; font-size: 12px;">
            DZ Boutique · Paiement a la livraison · ${new Date().getFullYear()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}