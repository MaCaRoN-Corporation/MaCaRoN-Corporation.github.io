import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo image', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.logo');
    expect(logo).toBeTruthy();
    expect(logo?.getAttribute('src')).toBe('assets/images/logo.svg');
    expect(logo?.getAttribute('alt')).toBe('Keiko Hub');
  });

  it('should have start button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.start-button');
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Démarrer');
  });

  it('should have settings link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('.settings-link');
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Réglages');
  });

  it('should navigate to /config when start button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.start-button') as HTMLButtonElement;
    
    button?.click();
    
    expect(router.navigate).toHaveBeenCalledWith(['/config']);
  });

  it('should call startPassage when button is clicked', () => {
    spyOn(component, 'startPassage');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.start-button') as HTMLButtonElement;
    
    button?.click();
    
    expect(component.startPassage).toHaveBeenCalled();
  });
});
