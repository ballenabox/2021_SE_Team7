//Kakao Pay API Usage

//Using https and express.
const https = require('https')
const express = require('express')
const app = express()

//Pages for Simple messages. 
app.get('/pay/success', (req, res) => {
	res.send('Payment Success!')
})
app.get('/pay/cancel', (req, res) => {
        res.send('Payment Canceled... -_-;;')
})
app.get('/pay/fail', (req, res) => {
        res.send('Payment Failed... T_T')
})

app.listen(3000, () => console.log('Server Running on port 3000'))

//Put your Admin Key here.
const admin_key = '{your admin key}'

//Using qs for parameters.
const qs = require('qs')

//Setting headers.
const options = {
  hostname: 'kapi.kakao.com',
  path: '/v1/payment/ready',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Authorization': `KakaoAK ${admin_key}`
  }
}

//Parameters - replace values as you want, **except cid**.
const data = qs.stringify({
	cid: 'TC0ONETIME',
	partner_order_id: '00000001',
	partner_user_id: 'test_user',
	item_name: 'SeoulTech SE',
	quantity: 1,
	total_amount: 10000,
	tax_free_amount: 10000,
	approval_url: '{your URL}/pay/success',
	cancel_url: '{your URL}/pay/cancel',
	fail_url: '{your URL}/pay/cancel'
})

//Request
const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)
  res.on('data', d => {
	  process.stdout.write(d)
	  const json = JSON.parse(d)
	  app.get('/', (req, res) => {
		//Redirect to QR Code.
		  res.redirect(`${json.next_redirect_pc_url}`)
	  })
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()
