const promo = document.forms['promo']
	if (promo) {
		promo.addEventListener('submit', addPromo)
	}

	async function addPromo(e) {
		e.preventDefault()
		const coupon = promo['coupon'].value
		load('#loading__coupon')
		try {
			await youcanjs.checkout.applyCoupon(coupon)
		} catch (e) {
			console.error(e)
			notify(e.message, 'error')
		} finally {
			stopLoad('#loading__coupon')
		}
	}

	function updateDOM(cartItemId, productVariantId, quantity) {
		const inputHolder = document.getElementById(cartItemId)
		const input = inputHolder.querySelector(`input[id="${productVariantId}"]`)
		input.value = quantity
		const decrease = input.previousElementSibling
		const increase = input.nextElementSibling

		decrease.querySelector('button').setAttribute('onclick', `decreaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) - 1}')`)
		increase.querySelector('button').setAttribute('onclick', `increaseQuantity('${cartItemId}', '${productVariantId}', '${Number(quantity) + 1}')`)
	}

	async function updateQuantiry(cartItemId, productVariantId, quantity) {
		load(`#loading__${cartItemId}`)
		try {
			await youcanjs.cart.updateItem({ cartItemId, productVariantId, quantity })
		} catch (e) {
			console.error(e)
			notify(e.message, 'error')
		} finally {
			stopLoad(`#loading__${cartItemId}`)
		}
		updateDOM(cartItemId, productVariantId, quantity)
	}

	async function updateOnchange(cartItemId, productVariantId) {
		const inputHolder = document.getElementById(cartItemId)
		const input = inputHolder.querySelector(`input[id="${productVariantId}"]`)
		const quantity = input.value

		await updateQuantiry(cartItemId, productVariantId, quantity)
		updateDOM(cartItemId, productVariantId, quantity)
	}

	async function decreaseQuantity(cartItemId, productVariantId, quantity) {
		if (quantity < 1) {
			return
		}
		await updateQuantiry(cartItemId, productVariantId, quantity)
	}

	async function increaseQuantity(cartItemId, productVariantId, quantity) {
		await updateQuantiry(cartItemId, productVariantId, quantity)
	}

	async function removeItem(cartItemId, productVariantId) {
		load(`#loading__${cartItemId}`)
		try {
			await youcanjs.cart.removeItem({ cartItemId, productVariantId })
			document.getElementById(cartItemId).remove()

			const cartItemsPadge = document.getElementById('cart-items-padge')

			const cartItems = document.querySelectorAll('.cart__item')

			if (cartItemsPadge) {
				cartItemsPadge.innerText = parseInt(cartItemsPadge.innerText) + 1
			}

			if (cartItems.length === 0) {
				if (cartItemsPadge) {
					cartItemsPadge.innerText = 0
				}
				document.querySelector('.cart-table').remove()
				document.querySelector('.empty-cart').classList.remove('hidden')
			}
		} catch (e) {
			console.error(e)
			notify(e.message, 'error')
		} finally {
			stopLoad(`#loading__${cartItemId}`)
		}
	}
