import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, typography, spacing } from '@/theme/tokens';
import { DnsCheckResult } from '@/types/speedtest';

interface DnsBarProps {
  dnsCheck: DnsCheckResult | null;
  isRunning: boolean;
}

export default function DnsBar({ dnsCheck, isRunning }: DnsBarProps) {
  const [expanded, setExpanded] = useState(false);

  const probes = dnsCheck?.probes ?? [];
  const passCount = probes.filter((p) => p.status === 'pass').length;

  return (
    <View
      style={{
        paddingVertical: spacing.dataRowPaddingVertical,
        paddingHorizontal: spacing.dataRowPaddingHorizontal,
        borderTopWidth: 2,
        borderTopColor: colors.ink,
      }}
    >
      <Text style={typography.metaLabel}>DNS CONNECTIVITY</Text>

      <Pressable
        onPress={() => dnsCheck && setExpanded(!expanded)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}
      >
        {/* Dots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const probe = probes[i];
          let dotColor: string = colors.bgScreen; // pending
          if (probe) {
            dotColor = probe.status === 'pass' ? '#34c759' : colors.error;
          }
          return (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: dotColor,
                borderWidth: 1,
                borderColor: colors.ink,
              }}
            />
          );
        })}

        {/* Summary */}
        <Text style={{ ...typography.metaValue, fontSize: 10, marginLeft: 8, color: colors.ink, opacity: 0.6 }}>
          {isRunning && !dnsCheck
            ? 'SCANNING...'
            : dnsCheck
              ? `${passCount}/${probes.length} REACHABLE${dnsCheck.avgTotalMs != null ? ` \u00B7 ${dnsCheck.avgTotalMs.toFixed(0)}ms` : ''}`
              : ''}
        </Text>
      </Pressable>

      {/* Expanded overlay */}
      {expanded && dnsCheck && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            marginTop: 8,
            padding: 12,
            backgroundColor: colors.paper,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.ink,
            borderCurve: 'continuous',
            gap: 4,
          }}
        >
          {probes.map((probe) => (
            <View key={probe.domain} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...typography.metaValue, fontSize: 11, color: colors.ink }}>
                {probe.domain}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {probe.totalMs != null && (
                  <Text style={{ ...typography.metaValue, fontSize: 10, color: colors.ink, opacity: 0.5 }}>
                    {probe.totalMs.toFixed(0)}ms
                  </Text>
                )}
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: probe.status === 'pass' ? '#34c759' : colors.error,
                  }}
                />
              </View>
            </View>
          ))}
          {dnsCheck.avgTotalMs != null && (
            <View style={{ borderTopWidth: 1, borderTopColor: colors.bgScreen, paddingTop: 4, marginTop: 4 }}>
              <Text style={{ ...typography.metaLabel, fontSize: 9 }}>
                AVG RESPONSE: {dnsCheck.avgTotalMs.toFixed(0)}ms
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}
