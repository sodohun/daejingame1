class HapticManager {
  private enabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('bejeweled_haptics');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('bejeweled_haptics', String(enabled));
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public vibrate(pattern: number | number[]) {
    if (!this.enabled) return;
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration errors if not permitted
    }
  }

  public tap() {
    this.vibrate(8);
  }

  public match() {
    this.vibrate(20);
  }

  public explosion() {
    this.vibrate([25, 20, 40]);
  }

  public squareBlast() {
    this.vibrate([20, 15, 35]);
  }

  public invalid() {
    this.vibrate([15, 10, 15]);
  }

  public levelUp() {
    this.vibrate([30, 25, 30, 25, 50]);
  }
}

export const hapticManager = new HapticManager();
