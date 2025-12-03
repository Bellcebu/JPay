# app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    SolicitudPrestamoViewSet,
    SesionViewSet,
    PrestamoViewSet,
    CuotaViewSet,
    PagoViewSet,
    NotificacionViewSet,
    CuentaViewSet,
    CuentaVinculadaViewSet,
    MovimientoViewSet,
    SimuladorPrestamoView,
    LoginView,
    LogoutView,
    SignUpView,
    GenerarQRView,
    ParsearQRView,
    PagarQRView,
    TransferenciaView,
    KYCUploadDNIView,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'solicitudes', SolicitudPrestamoViewSet, basename='solicitud')
router.register(r'sesiones', SesionViewSet, basename='sesion')
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')
router.register(r'cuotas', CuotaViewSet, basename='cuota')
router.register(r'pagos', PagoViewSet, basename='pago')
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')
router.register(r'cuentas', CuentaViewSet, basename='cuenta')
router.register(r'cuentas-vinculadas', CuentaVinculadaViewSet, basename='cuenta-vinculada')
router.register(r'movimientos', MovimientoViewSet, basename='movimiento')

urlpatterns = [
    path('', include(router.urls)),
    path("simulador-prestamo/", SimuladorPrestamoView.as_view(), name="simulador-prestamo"),
    path("auth/login/", LoginView.as_view(), name="api-login"),
    path("auth/logout/", LogoutView.as_view(), name="api-logout"),
    path("auth/signup/", SignUpView.as_view(), name="api-signup"),
    path("qr/generar/", GenerarQRView.as_view(), name="qr-generar"),
    path("qr/parsear/", ParsearQRView.as_view(), name="qr-parsear"),
    path("qr/pagar/", PagarQRView.as_view(), name="qr-pagar"),
    path("transferencias/", TransferenciaView.as_view(), name="transferencias"),
    path("auth/kyc/dni/", KYCUploadDNIView.as_view(), name="kyc-dni-upload"),
    path("", include(router.urls)),
]
