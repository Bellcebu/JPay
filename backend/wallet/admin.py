from django.contrib import admin
from .models import Usuario, Cuenta, Movimiento

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'dni')
    search_fields = ('username', 'email', 'dni')

@admin.register(Cuenta)
class CuentaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'cvu', 'alias', 'saldo')
    search_fields = ('usuario__username', 'cvu', 'alias')
    list_editable = ('saldo',)

@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('cuenta', 'tipo', 'monto', 'creado_en')
    list_filter = ('tipo', 'creado_en')
