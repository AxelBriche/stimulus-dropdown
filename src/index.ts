import { Controller } from '@hotwired/stimulus'
import { useTransition } from 'stimulus-use'

export default class extends Controller {
  menuTarget: HTMLElement
  toggleTransition: (event?: Event) => void
  leave: (event?: Event) => void
  transitioned: false

  static targets = ['menu']

  connect (): void {
    useTransition(this, {
      element: this.menuTarget,
      enterActive: 'enter-active',
    })
  }

  toggle ({
    target
  }: {
    target: HTMLInputElement
  }): void {
    this.toggleTransition()
    this.updateMenuPosition(target)
  }

  updateMenuPosition (target: HTMLInputElement): void {
    const menuRect = this.menuTarget.getBoundingClientRect()
    const buttonRect = target.getBoundingClientRect()

    if(!this.menuTarget.classList.contains('enter-active')) return;

    if (buttonRect.right <= menuRect.width) {
      this.hangLeft();
      return;
    };

    this.hang(menuRect, target.offsetHeight)
  }

  hang (menuRect: DOMRect, menuOffsetHeight: number): void {
    if (menuRect.left < 0) {
      this.hangLeft()
    }
    else if (menuRect.right > window.innerWidth) {
      this.hangRight()
    }

    if (menuRect.top < 0) {
      this.hangTop(menuOffsetHeight)
    }
    else if (menuRect.bottom > window.innerHeight) {
      this.hangBottom(menuOffsetHeight)
    }
  }

  hangLeft (): void {
    this.menuTarget.style.left = '0px'
    this.menuTarget.style.right = 'auto'
  }

  hangRight (): void {
    this.menuTarget.style.right = '0px'
    this.menuTarget.style.left = 'auto'
  }

  hangBottom (buttonHeight: number): void {
    this.menuTarget.style.bottom = `${buttonHeight + 10}px`
  }

  hangTop (buttonHeight: number): void {
    this.menuTarget.style.top = `${buttonHeight + 10}px`
  }

  hide (event: Event): void {
    const node = event.target as Node
    if (!this.element.contains(node) && !this.menuTarget.classList.contains('hidden')) {
      this.leave()
    }
  }
}
